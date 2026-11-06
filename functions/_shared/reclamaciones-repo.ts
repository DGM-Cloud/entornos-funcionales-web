import { createReclamacionCodigo, createUuid, utcIsoNow } from './ids';
import type { ReclamacionPayload } from './validate';

export type MailChannelStatus = 'pending' | 'sending' | 'sent' | 'failed';
export type MailOverallStatus = 'pending' | 'sent' | 'mail_pending' | 'partial';
export type MailChannel = 'empresa' | 'constancia';

/** Máximo de intentos de envío por canal (incluye el primero). */
export const MAIL_MAX_ATTEMPTS = 3;
/** Espera mínima entre reintentos del mismo canal. */
export const MAIL_RETRY_COOLDOWN_MS = 60_000;
/** Si un claim `sending` queda huérfano, se puede reclamar de nuevo. */
export const MAIL_STALE_SENDING_MS = 5 * 60_000;

export interface ReclamacionRow {
  id: string;
  codigo: string;
  created_at: string;
  idempotency_key: string | null;
  content_hash: string | null;
  es_menor: number;
  nombre_apoderado: string | null;
  nombre: string;
  documento: string;
  telefono: string;
  domicilio: string;
  correo: string;
  tipo_bien: string;
  monto_reclamado: string | null;
  descripcion_bien: string;
  tipo_reclamo: string;
  detalle: string;
  pedido: string;
  mail_status: MailOverallStatus;
  mail_empresa_status: MailChannelStatus;
  mail_constancia_status: MailChannelStatus;
  mail_empresa_at: string | null;
  mail_constancia_at: string | null;
  mail_last_error: string | null;
  mail_empresa_attempts: number;
  mail_constancia_attempts: number;
  mail_empresa_claim_at: string | null;
  mail_constancia_claim_at: string | null;
}

const SELECT_COLS = `id, codigo, created_at, idempotency_key, content_hash,
  es_menor, nombre_apoderado, nombre, documento, telefono, domicilio, correo,
  tipo_bien, monto_reclamado, descripcion_bien, tipo_reclamo, detalle, pedido,
  mail_status, mail_empresa_status, mail_constancia_status,
  mail_empresa_at, mail_constancia_at, mail_last_error,
  COALESCE(mail_empresa_attempts, 0) AS mail_empresa_attempts,
  COALESCE(mail_constancia_attempts, 0) AS mail_constancia_attempts,
  mail_empresa_claim_at, mail_constancia_claim_at`;

export function deriveOverallMailStatus(
  empresa: MailChannelStatus,
  constancia: MailChannelStatus,
): MailOverallStatus {
  const e = empresa === 'sending' ? 'pending' : empresa;
  const c = constancia === 'sending' ? 'pending' : constancia;

  if (e === 'sent' && c === 'sent') {
    return 'sent';
  }
  if (e === 'sent' || c === 'sent') {
    return 'partial';
  }
  if (e === 'pending' && c === 'pending') {
    return 'pending';
  }
  return 'mail_pending';
}

/** Estado expuesto al navegador (sin filtrar PII; `sending` → pending). */
export function publicChannelStatus(
  status: MailChannelStatus,
): 'pending' | 'sent' | 'failed' {
  if (status === 'sent') return 'sent';
  if (status === 'failed') return 'failed';
  return 'pending';
}

export async function findByIdempotencyKey(
  db: D1Database,
  key: string,
): Promise<ReclamacionRow | null> {
  const result = await db
    .prepare(`SELECT ${SELECT_COLS} FROM reclamaciones WHERE idempotency_key = ? LIMIT 1`)
    .bind(key)
    .first<ReclamacionRow>();
  return result ?? null;
}

export async function findById(db: D1Database, id: string): Promise<ReclamacionRow | null> {
  const result = await db
    .prepare(`SELECT ${SELECT_COLS} FROM reclamaciones WHERE id = ? LIMIT 1`)
    .bind(id)
    .first<ReclamacionRow>();
  return result ?? null;
}

function isUniqueViolation(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /UNIQUE constraint failed/i.test(message);
}

/**
 * Inserta una reclamación con código único.
 * Ante colisión de `codigo` reintenta; ante colisión de `idempotency_key` relanza.
 */
export async function insertReclamacion(
  db: D1Database,
  payload: ReclamacionPayload,
  opts: { idempotencyKey: string; contentHash: string },
): Promise<ReclamacionRow> {
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const id = createUuid();
    const codigo = createReclamacionCodigo();
    const createdAt = utcIsoNow();

    try {
      await db
        .prepare(
          `INSERT INTO reclamaciones (
            id, codigo, created_at, idempotency_key, content_hash,
            es_menor, nombre_apoderado, nombre, documento, telefono, domicilio, correo,
            tipo_bien, monto_reclamado, descripcion_bien, tipo_reclamo, detalle, pedido,
            mail_status, mail_empresa_status, mail_constancia_status,
            mail_empresa_attempts, mail_constancia_attempts
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending', 0, 0)`,
        )
        .bind(
          id,
          codigo,
          createdAt,
          opts.idempotencyKey,
          opts.contentHash,
          payload.esMenor ? 1 : 0,
          payload.esMenor ? payload.nombreApoderado : null,
          payload.nombre,
          payload.documento,
          payload.telefono,
          payload.domicilio,
          payload.correo,
          payload.tipoBien,
          payload.montoReclamado || null,
          payload.descripcionBien,
          payload.tipoReclamo,
          payload.detalle,
          payload.pedido,
        )
        .run();

      const row = await findById(db, id);
      if (!row) {
        throw new Error('insert_missing_row');
      }
      return row;
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }

      const existing = await findByIdempotencyKey(db, opts.idempotencyKey);
      if (existing) {
        const conflict = new Error('idempotency_conflict');
        (conflict as Error & { existing: ReclamacionRow }).existing = existing;
        throw conflict;
      }

      continue;
    }
  }

  throw new Error('codigo_collision_exhausted');
}

/**
 * Reclama un canal para envío de forma atómica.
 * Solo un worker puede obtener `claimed` a la vez por canal.
 */
export async function claimMailChannel(
  db: D1Database,
  id: string,
  channel: MailChannel,
  nowIso = utcIsoNow(),
): Promise<'claimed' | 'skip'> {
  const statusCol =
    channel === 'empresa' ? 'mail_empresa_status' : 'mail_constancia_status';
  const attemptsCol =
    channel === 'empresa' ? 'mail_empresa_attempts' : 'mail_constancia_attempts';
  const claimCol =
    channel === 'empresa' ? 'mail_empresa_claim_at' : 'mail_constancia_claim_at';

  const nowMs = Date.parse(nowIso);
  const cooldownIso = new Date(nowMs - MAIL_RETRY_COOLDOWN_MS).toISOString();
  const staleIso = new Date(nowMs - MAIL_STALE_SENDING_MS).toISOString();

  // pending/failed con intentos restantes y cooldown cumplido,
  // o sending huérfano (stale) con intentos restantes.
  const result = await db
    .prepare(
      `UPDATE reclamaciones SET
         ${statusCol} = 'sending',
         ${attemptsCol} = ${attemptsCol} + 1,
         ${claimCol} = ?
       WHERE id = ?
         AND ${attemptsCol} < ?
         AND (
           (
             ${statusCol} IN ('pending', 'failed')
             AND (${claimCol} IS NULL OR ${claimCol} <= ?)
           )
           OR (
             ${statusCol} = 'sending'
             AND ${claimCol} IS NOT NULL
             AND ${claimCol} <= ?
           )
         )`,
    )
    .bind(nowIso, id, MAIL_MAX_ATTEMPTS, cooldownIso, staleIso)
    .run();

  const changes = Number(result.meta?.changes ?? 0);
  return changes === 1 ? 'claimed' : 'skip';
}

export async function finalizeMailChannel(
  db: D1Database,
  id: string,
  channel: MailChannel,
  outcome: 'sent' | 'failed',
  opts: { sentAt?: string | null; lastError?: string | null } = {},
): Promise<ReclamacionRow | null> {
  const statusCol =
    channel === 'empresa' ? 'mail_empresa_status' : 'mail_constancia_status';
  const atCol = channel === 'empresa' ? 'mail_empresa_at' : 'mail_constancia_at';

  if (outcome === 'sent') {
    await db
      .prepare(
        `UPDATE reclamaciones SET
           ${statusCol} = 'sent',
           ${atCol} = COALESCE(?, ${atCol})
         WHERE id = ? AND ${statusCol} = 'sending'`,
      )
      .bind(opts.sentAt ?? utcIsoNow(), id)
      .run();
  } else {
    await db
      .prepare(
        `UPDATE reclamaciones SET
           ${statusCol} = 'failed',
           mail_last_error = COALESCE(?, mail_last_error)
         WHERE id = ? AND ${statusCol} = 'sending'`,
      )
      .bind(opts.lastError ?? `${channel}:failed`, id)
      .run();
  }

  // Recalcular agregado a partir de ambos canales.
  const row = await findById(db, id);
  if (!row) {
    return null;
  }

  const overall = deriveOverallMailStatus(row.mail_empresa_status, row.mail_constancia_status);
  await db
    .prepare(`UPDATE reclamaciones SET mail_status = ? WHERE id = ?`)
    .bind(overall, id)
    .run();

  return findById(db, id);
}

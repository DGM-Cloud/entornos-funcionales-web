import { createUuid, formatReclamacionCodigo, utcIsoNow } from './ids';
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
  domicilio_apoderado: string | null;
  telefono_apoderado: string | null;
  correo_apoderado: string | null;
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
  es_menor, nombre_apoderado, domicilio_apoderado, telefono_apoderado, correo_apoderado,
  nombre, documento, telefono, domicilio, correo,
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

async function allocateReclamacionNumero(db: D1Database): Promise<number> {
  const result = await db
    .prepare(
      `UPDATE reclamacion_secuencia
       SET ultimo = ultimo + 1
       WHERE id = 1
       RETURNING ultimo`,
    )
    .first<{ ultimo: number }>();

  if (!result || typeof result.ultimo !== 'number' || result.ultimo < 1) {
    throw new Error('secuencia_unavailable');
  }
  return result.ultimo;
}

/**
 * Recupera un número solo si no se persistió el código y sigue siendo la punta.
 *
 * Una sola sentencia atómica: no decrementa si otra solicitud ya avanzó la
 * secuencia (`ultimo != numero`) ni si el código ya pertenece a una reclamación
 * confirmada (`NOT EXISTS`). Así no se reutiliza un correlativo ajeno.
 */
async function reclaimTipNumero(db: D1Database, numero: number): Promise<void> {
  const codigo = formatReclamacionCodigo(numero);
  await db
    .prepare(
      `UPDATE reclamacion_secuencia
       SET ultimo = ultimo - 1
       WHERE id = 1
         AND ultimo = ?
         AND NOT EXISTS (
           SELECT 1 FROM reclamaciones WHERE codigo = ?
         )`,
    )
    .bind(numero, codigo)
    .run();
}

/**
 * Inserta reclamación con correlativo.
 *
 * No se usa `db.batch()` ni CTE writable: en SQLite/D1 no hay forma segura de
 * ligar `UPDATE … RETURNING` al `INSERT` en una sola llamada preparada, y el
 * `batch()` con subconsulta sobre la secuencia colgó D1 local en pruebas previas.
 * Flujo: allocate (`UPDATE … RETURNING`) → `INSERT` con ese mismo `numero` →
 * `reclaimTipNumero` solo si el INSERT no persistió el código.
 *
 * Garantías:
 * - El `codigo` del INSERT es exactamente el reservado por `RETURNING`.
 * - Sin duplicar correlativos (UNIQUE + allocate atómico).
 * - Idempotencia por clave (conflicto → fila existente).
 * - Concurrencia: writers serializan en UPDATE de secuencia.
 * - No reutiliza números confirmados ni reservados por otra solicitud.
 *
 * Riesgo residual: si el proceso muere entre allocate e INSERT, puede quedar un
 * hueco (aceptable). No hay duplicados.
 */
export async function insertReclamacion(
  db: D1Database,
  payload: ReclamacionPayload,
  opts: { idempotencyKey: string; contentHash: string },
): Promise<ReclamacionRow> {
  const maxAttempts = 8;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const id = createUuid();
    const createdAt = utcIsoNow();
    const numero = await allocateReclamacionNumero(db);
    const codigo = formatReclamacionCodigo(numero);

    try {
      await db
        .prepare(
          `INSERT INTO reclamaciones (
            id, codigo, created_at, idempotency_key, content_hash,
            es_menor, nombre_apoderado, domicilio_apoderado, telefono_apoderado, correo_apoderado,
            nombre, documento, telefono, domicilio, correo,
            tipo_bien, monto_reclamado, descripcion_bien, tipo_reclamo, detalle, pedido,
            mail_status, mail_empresa_status, mail_constancia_status,
            mail_empresa_attempts, mail_constancia_attempts
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', 'pending', 0, 0)`,
        )
        .bind(
          id,
          codigo,
          createdAt,
          opts.idempotencyKey,
          opts.contentHash,
          payload.esMenor ? 1 : 0,
          payload.esMenor ? payload.nombreApoderado : null,
          payload.esMenor ? payload.domicilioApoderado : null,
          payload.esMenor ? payload.telefonoApoderado : null,
          payload.esMenor ? payload.correoApoderado : null,
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
      await reclaimTipNumero(db, numero);

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

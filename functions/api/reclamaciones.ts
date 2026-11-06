import { hashReclamacionPayload } from '../_shared/content-hash';
import { handleCorsPreflight } from '../_shared/cors';
import { MAIL } from '../_shared/env';
import {
  jsonError,
  jsonOk,
  methodNotAllowed,
  readJsonBody,
} from '../_shared/http';
import { utcIsoNow } from '../_shared/ids';
import { isLocalMockRuntime, resolveResendMockMode } from '../_shared/mock-mode';
import {
  buildConstanciaReclamacionHtml,
  buildEmpresaReclamacionHtml,
} from '../_shared/reclamacion-mail';
import {
  claimMailChannel,
  finalizeMailChannel,
  findById,
  findByIdempotencyKey,
  insertReclamacion,
  publicChannelStatus,
  type ReclamacionRow,
} from '../_shared/reclamaciones-repo';
import {
  buildConstanciaSubject,
  buildReclamacionSubject,
  sendResendEmail,
} from '../_shared/resend';
import { verifyTurnstileToken } from '../_shared/turnstile';
import { validateReclamacion, type ReclamacionPayload } from '../_shared/validate';

/** UUID v4 — suficiente entropía; coincide con crypto.randomUUID() del frontend. */
const IDEMPOTENCY_KEY_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function publicMailStatus(row: ReclamacionRow) {
  return {
    empresa: publicChannelStatus(row.mail_empresa_status),
    constancia: publicChannelStatus(row.mail_constancia_status),
    overall: row.mail_status,
  };
}

function successMessage(row: ReclamacionRow): string {
  const empresaOk = row.mail_empresa_status === 'sent';
  const constanciaOk = row.mail_constancia_status === 'sent';

  if (empresaOk && constanciaOk) {
    return 'Su reclamación fue registrada correctamente. Se envió la constancia a su correo electrónico.';
  }
  if (constanciaOk) {
    return 'Su reclamación fue registrada correctamente. La constancia fue enviada; la notificación interna quedó pendiente.';
  }
  if (empresaOk) {
    return 'Su reclamación fue registrada correctamente. La notificación electrónica al consumidor está pendiente o no pudo confirmarse.';
  }
  return 'Su reclamación fue registrada correctamente. La notificación electrónica está pendiente o no pudo confirmarse. Conserve su código de reclamación.';
}

/**
 * Envía correos con claim atómico por canal.
 * No garantiza exactamente-una-vez si Resend acepta y luego falla el UPDATE a D1;
 * en ese caso el canal queda `sending` hasta reclamación stale + verificación manual.
 */
async function dispatchMails(
  env: Env,
  row: ReclamacionRow,
  payload: ReclamacionPayload,
): Promise<ReclamacionRow> {
  const ctx = { codigo: row.codigo, createdAt: row.created_at, payload };
  const mockMode = resolveResendMockMode(env);
  const now = utcIsoNow();
  let current = row;

  if (current.mail_empresa_status !== 'sent') {
    const claim = await claimMailChannel(env.DB, current.id, 'empresa', now);
    if (claim === 'claimed') {
      const result = await sendResendEmail(
        env.RESEND_API_KEY,
        {
          to: MAIL.reclamosTo,
          replyTo: payload.correo,
          subject: buildReclamacionSubject(current.codigo),
          html: buildEmpresaReclamacionHtml(ctx),
        },
        { mockMode, mockChannel: 'empresa' },
      );

      current =
        (await finalizeMailChannel(
          env.DB,
          current.id,
          'empresa',
          result.ok ? 'sent' : 'failed',
          {
            sentAt: result.ok ? now : null,
            lastError: result.ok ? null : `empresa:${result.reason}`,
          },
        )) ?? current;
    }
  }

  if (current.mail_constancia_status !== 'sent') {
    const claim = await claimMailChannel(env.DB, current.id, 'constancia', now);
    if (claim === 'claimed') {
      const result = await sendResendEmail(
        env.RESEND_API_KEY,
        {
          to: payload.correo,
          replyTo: MAIL.reclamosTo,
          subject: buildConstanciaSubject(current.codigo),
          html: buildConstanciaReclamacionHtml(ctx),
        },
        { mockMode, mockChannel: 'constancia' },
      );

      current =
        (await finalizeMailChannel(
          env.DB,
          current.id,
          'constancia',
          result.ok ? 'sent' : 'failed',
          {
            sentAt: result.ok ? now : null,
            lastError: result.ok ? null : `constancia:${result.reason}`,
          },
        )) ?? current;
    }
  }

  return (await findById(env.DB, current.id)) ?? current;
}

function respondRegistered(
  env: Env,
  request: Request,
  row: ReclamacionRow,
  reused: boolean,
): Response {
  return jsonOk(env, request, 200, successMessage(row), {
    codigo: row.codigo,
    createdAt: row.created_at,
    mail: publicMailStatus(row),
    reused,
  });
}

function contentMismatchResponse(env: Env, request: Request): Response {
  return jsonError(
    env,
    request,
    409,
    'conflict',
    'Esta clave de idempotencia ya fue usada con un contenido distinto.',
  );
}

/**
 * POST /api/reclamaciones
 * Valida → Turnstile (solo altas nuevas) → idempotencia D1 → insert → Resend ×2 → respuesta veraz.
 */
export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;

  const preflight = handleCorsPreflight(env, request);
  if (preflight) {
    return preflight;
  }

  if (request.method !== 'POST') {
    return methodNotAllowed(env, request);
  }

  if (!env.DB) {
    return jsonError(
      env,
      request,
      503,
      'internal_error',
      'El servicio de registro no está disponible temporalmente. Intente más tarde.',
    );
  }

  const idempotencyKey = request.headers.get('Idempotency-Key')?.trim() ?? '';
  if (!IDEMPOTENCY_KEY_RE.test(idempotencyKey)) {
    return jsonError(
      env,
      request,
      400,
      'validation_error',
      'La clave de idempotencia no es válida.',
      { idempotencyKey: 'Se requiere un UUID v4 en el encabezado Idempotency-Key.' },
    );
  }

  const parsed = await readJsonBody(env, request);
  if (!parsed.ok) {
    return parsed.response;
  }

  const validation = validateReclamacion(parsed.value);
  if (!validation.ok) {
    return jsonError(
      env,
      request,
      400,
      'validation_error',
      'Los datos de la reclamación no son válidos.',
      validation.details,
    );
  }

  const payload = validation.value;
  const contentHash = await hashReclamacionPayload(payload);

  // Idempotencia: misma clave + mismo hash → no exige Turnstile nuevo (token de un solo uso).
  // No se filtra PII: solo codigo/fecha/estados de correo.
  const existing = await findByIdempotencyKey(env.DB, idempotencyKey);
  if (existing) {
    if (!existing.content_hash || existing.content_hash !== contentHash) {
      return contentMismatchResponse(env, request);
    }

    // Reintento acotado: claim + cooldown + max intentos (no envíos ilimitados).
    const refreshed =
      existing.mail_empresa_status !== 'sent' || existing.mail_constancia_status !== 'sent'
        ? await dispatchMails(env, existing, payload)
        : existing;

    return respondRegistered(env, request, refreshed, true);
  }

  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
  const localMock = isLocalMockRuntime(env);

  // Mock local (RESEND_MOCK_MODE sin RESEND_API_KEY) tiene prioridad sobre
  // TURNSTILE_SECRET_KEY residual, para pruebas sin challenge real ni correos reales.
  if (localMock) {
    if (!payload.turnstileToken || payload.turnstileToken === 'invalid') {
      return jsonError(
        env,
        request,
        403,
        'turnstile_failed',
        'No pudimos verificar la solicitud. Actualice la verificación e intente nuevamente.',
      );
    }
  } else if (turnstileSecret) {
    const remoteip =
      request.headers.get('CF-Connecting-IP') ??
      request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
      undefined;

    const turnstile = await verifyTurnstileToken({
      secret: turnstileSecret,
      token: payload.turnstileToken,
      remoteip,
    });

    if (!turnstile.ok) {
      return jsonError(
        env,
        request,
        403,
        'turnstile_failed',
        'No pudimos verificar la solicitud. Actualice la verificación e intente nuevamente.',
      );
    }
  } else {
    return jsonError(
      env,
      request,
      503,
      'internal_error',
      'El servicio de verificación no está disponible temporalmente. Intente más tarde.',
    );
  }

  let row: ReclamacionRow;
  try {
    row = await insertReclamacion(env.DB, payload, {
      idempotencyKey,
      contentHash,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'idempotency_conflict') {
      const raced = (error as Error & { existing?: ReclamacionRow }).existing;
      if (raced) {
        if (!raced.content_hash || raced.content_hash !== contentHash) {
          return contentMismatchResponse(env, request);
        }
        const refreshed =
          raced.mail_empresa_status !== 'sent' || raced.mail_constancia_status !== 'sent'
            ? await dispatchMails(env, raced, payload)
            : raced;
        return respondRegistered(env, request, refreshed, true);
      }
    }

    return jsonError(
      env,
      request,
      503,
      'internal_error',
      'No pudimos registrar la reclamación en este momento. Intente nuevamente en unos minutos.',
    );
  }

  const afterMail = await dispatchMails(env, row, payload);
  return respondRegistered(env, request, afterMail, false);
};

import { handleCorsPreflight } from '../_shared/cors';
import { buildContactoEmailHtml } from '../_shared/contact-mail';
import { MAIL } from '../_shared/env';
import {
  jsonError,
  jsonOk,
  methodNotAllowed,
  readJsonBody,
} from '../_shared/http';
import { isDuplicateIdempotencyKey, rememberIdempotencyKey } from '../_shared/idempotency';
import { isLocalMockRuntime, resolveResendMockMode } from '../_shared/mock-mode';
import { buildContactoSubject, sendResendEmail } from '../_shared/resend';
import { verifyTurnstileToken } from '../_shared/turnstile';
import { validateContacto } from '../_shared/validate';

/**
 * POST /api/contacto
 * Valida payload + Turnstile y envía la consulta a cotizaciones@ vía Resend.
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

  const idempotencyKey = request.headers.get('Idempotency-Key');
  if (isDuplicateIdempotencyKey(idempotencyKey)) {
    return jsonError(
      env,
      request,
      409,
      'validation_error',
      'Esta solicitud ya fue procesada. Espere un momento antes de reintentar.',
    );
  }

  const parsed = await readJsonBody(env, request);
  if (!parsed.ok) {
    return parsed.response;
  }

  const validation = validateContacto(parsed.value);
  if (!validation.ok) {
    return jsonError(
      env,
      request,
      400,
      'validation_error',
      'Los datos del formulario de contacto no son válidos.',
      validation.details,
    );
  }

  const payload = validation.value;
  const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
  const localMock = isLocalMockRuntime(env);

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

  const mailResult = await sendResendEmail(
    env.RESEND_API_KEY,
    {
      to: MAIL.contactoTo,
      replyTo: payload.correo,
      subject: buildContactoSubject(payload.nombre),
      html: buildContactoEmailHtml(payload),
    },
    { mockMode: resolveResendMockMode(env) },
  );

  if (!mailResult.ok) {
    return jsonError(
      env,
      request,
      502,
      'internal_error',
      'No pudimos enviar su consulta en este momento. Intente nuevamente en unos minutos.',
    );
  }

  rememberIdempotencyKey(idempotencyKey);

  return jsonOk(
    env,
    request,
    200,
    'Su consulta fue enviada correctamente. Nos pondremos en contacto a la brevedad.',
  );
};

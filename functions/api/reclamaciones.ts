import { handleCorsPreflight } from '../_shared/cors';
import {
  jsonError,
  methodNotAllowed,
  notImplemented,
  readJsonBody,
} from '../_shared/http';
import { validateReclamacion } from '../_shared/validate';

/**
 * POST /api/reclamaciones
 * B2: endpoint preparatorio. Valida método, tamaño y payload,
 * pero NO escribe en D1 remoto ni envía correos.
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

  // Intencionalmente no se llama a Turnstile, D1 ni Resend en B2.
  return notImplemented(env, request, 'El registro de reclamaciones');
};

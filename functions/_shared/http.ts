import { corsHeaders } from './cors';
import { LIMITS } from './env';

export type ApiErrorCode =
  | 'method_not_allowed'
  | 'invalid_json'
  | 'payload_too_large'
  | 'validation_error'
  | 'turnstile_failed'
  | 'conflict'
  | 'not_implemented'
  | 'internal_error';

export interface ApiSuccessBody {
  ok: true;
  message: string;
  data?: Record<string, unknown>;
}

export interface ApiErrorBody {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, string>;
  };
}

function withCors(env: Env, request: Request, init: ResponseInit, body: unknown): Response {
  const headers = new Headers(init.headers);
  const cors = corsHeaders(env, request.headers.get('Origin'));
  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function jsonOk(
  env: Env,
  request: Request,
  status: number,
  message: string,
  data?: Record<string, unknown>,
): Response {
  const body: ApiSuccessBody = data ? { ok: true, message, data } : { ok: true, message };
  return withCors(env, request, { status }, body);
}

export function jsonError(
  env: Env,
  request: Request,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: Record<string, string>,
): Response {
  const body: ApiErrorBody = {
    ok: false,
    error: details ? { code, message, details } : { code, message },
  };
  return withCors(env, request, { status }, body);
}

export function methodNotAllowed(env: Env, request: Request): Response {
  return jsonError(
    env,
    request,
    405,
    'method_not_allowed',
    'Solo se admite el método POST.',
  );
}

export function notImplemented(env: Env, request: Request, feature: string): Response {
  return jsonError(
    env,
    request,
    501,
    'not_implemented',
    `${feature} aún no está disponible. La infraestructura backend está preparada pero la operación productiva no está activada.`,
  );
}

/** Lee y parsea JSON con límite de tamaño. No registra el body. */
export async function readJsonBody(
  env: Env,
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const contentLength = request.headers.get('Content-Length');
  if (contentLength) {
    const length = Number(contentLength);
    if (Number.isFinite(length) && length > LIMITS.maxBodyBytes) {
      return {
        ok: false,
        response: jsonError(
          env,
          request,
          413,
          'payload_too_large',
          'La solicitud excede el tamaño máximo permitido.',
        ),
      };
    }
  }

  const buffer = await request.arrayBuffer();
  if (buffer.byteLength > LIMITS.maxBodyBytes) {
    return {
      ok: false,
      response: jsonError(
        env,
        request,
        413,
        'payload_too_large',
        'La solicitud excede el tamaño máximo permitido.',
      ),
    };
  }

  try {
    const text = new TextDecoder().decode(buffer);
    if (!text.trim()) {
      return {
        ok: false,
        response: jsonError(env, request, 400, 'invalid_json', 'El cuerpo de la solicitud está vacío.'),
      };
    }
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return {
      ok: false,
      response: jsonError(env, request, 400, 'invalid_json', 'JSON inválido.'),
    };
  }
}

import { getAllowedOrigin } from './env';

const ALLOWED_METHODS = 'POST, OPTIONS';
const ALLOWED_HEADERS = 'Content-Type, Idempotency-Key';

export function corsHeaders(env: Env, requestOrigin: string | null): HeadersInit {
  const allowed = getAllowedOrigin(env);
  const origin =
    requestOrigin === allowed ||
    requestOrigin === 'http://localhost:8788' ||
    requestOrigin === 'http://127.0.0.1:8788'
      ? (requestOrigin ?? allowed)
      : allowed;

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': ALLOWED_METHODS,
    'Access-Control-Allow-Headers': ALLOWED_HEADERS,
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function handleCorsPreflight(env: Env, request: Request): Response | null {
  if (request.method !== 'OPTIONS') {
    return null;
  }

  return new Response(null, {
    status: 204,
    headers: corsHeaders(env, request.headers.get('Origin')),
  });
}

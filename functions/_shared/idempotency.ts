/**
 * Idempotencia BEST-EFFORT limitada al isolate de la Function.
 *
 * NO garantiza deduplicación entre isolates, regiones ni redeploys.
 * Sirve para atenuar dobles clics cercanos en el mismo worker caliente.
 *
 * Alternativa persistente recomendada (sin D1 de reclamaciones):
 * Cloudflare Workers KV con clave = Idempotency-Key y TTL corto (p. ej. 2–10 min),
 * escrita solo tras aceptación de Resend. No implementada en Fase C.
 */
const recentKeys = new Map<string, number>();
const TTL_MS = 120_000;
const MAX_ENTRIES = 500;

function prune(now: number): void {
  for (const [key, expiresAt] of recentKeys) {
    if (expiresAt <= now) {
      recentKeys.delete(key);
    }
  }
  if (recentKeys.size > MAX_ENTRIES) {
    const oldest = [...recentKeys.entries()].sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < oldest.length - MAX_ENTRIES; i += 1) {
      recentKeys.delete(oldest[i][0]);
    }
  }
}

/** @returns true si la clave ya fue usada con éxito recientemente. */
export function isDuplicateIdempotencyKey(key: string | null): boolean {
  if (!key) {
    return false;
  }
  const normalized = key.trim();
  if (!normalized) {
    return false;
  }
  const now = Date.now();
  prune(now);
  const existing = recentKeys.get(normalized);
  return Boolean(existing && existing > now);
}

/** Registrar solo tras un envío aceptado por Resend. */
export function rememberIdempotencyKey(key: string | null): void {
  if (!key) {
    return;
  }
  const normalized = key.trim();
  if (!normalized) {
    return;
  }
  const now = Date.now();
  prune(now);
  recentKeys.set(normalized, now + TTL_MS);
}

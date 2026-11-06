/** UUID v4 con Web Crypto (disponible en Workers / Pages). */
export function createUuid(): string {
  return crypto.randomUUID();
}

/**
 * Código de reclamación legible y único.
 * Formato: EF-REC-YYYYMMDD-XXXX (4 hex = 65 536 valores/día).
 * La unicidad se garantiza con UNIQUE en D1 + reintentos ante colisión.
 */
export function createReclamacionCodigo(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `EF-REC-${y}${m}${d}-${suffix}`;
}

export function utcIsoNow(): string {
  return new Date().toISOString();
}

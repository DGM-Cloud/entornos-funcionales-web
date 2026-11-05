/** UUID v4 con Web Crypto (disponible en Workers / Pages). */
export function createUuid(): string {
  return crypto.randomUUID();
}

/**
 * Código de reclamación legible y único.
 * Formato: EF-REC-YYYYMMDD-XXXXXX (hex aleatorio).
 */
export function createReclamacionCodigo(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `EF-REC-${y}${m}${d}-${suffix}`;
}

export function utcIsoNow(): string {
  return new Date().toISOString();
}

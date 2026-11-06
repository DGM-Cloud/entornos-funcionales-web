/** UUID v4 con Web Crypto (disponible en Workers / Pages). */
export function createUuid(): string {
  return crypto.randomUUID();
}

/**
 * Fecha civil YYYYMMDD en zona America/Lima (independiente del TZ del runtime).
 * Perú no aplica horario de verano; offset fijo UTC−5.
 */
export function limaYmd(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  if (!year || !month || !day) {
    // Fallback defensivo: no debería ocurrir en Workers/Node modernos.
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  }

  return `${year}${month}${day}`;
}

/**
 * Código de reclamación legible y único.
 * Formato: EF-REC-YYYYMMDD-XXXX (YYYYMMDD = fecha Perú; 4 hex aleatorios).
 * La unicidad se garantiza con UNIQUE en D1 + reintentos ante colisión.
 * created_at en D1 sigue siendo UTC (utcIsoNow), independiente de este código.
 */
export function createReclamacionCodigo(now = new Date()): string {
  const ymd = limaYmd(now);
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `EF-REC-${ymd}-${suffix}`;
}

export function utcIsoNow(): string {
  return new Date().toISOString();
}

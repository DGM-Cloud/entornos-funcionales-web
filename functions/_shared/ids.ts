/** UUID v4 con Web Crypto (disponible en Workers / Pages). */
export function createUuid(): string {
  return crypto.randomUUID();
}

/**
 * Formatea el correlativo público del Libro de Reclamaciones.
 * Ejemplo: 1 → EF-000001
 *
 * Este valor actúa como numeración correlativa y código de identificación
 * público único. El UUID interno (`id`) no se expone al consumidor.
 */
export function formatReclamacionCodigo(n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new Error('codigo_secuencia_invalida');
  }
  return `EF-${String(n).padStart(6, '0')}`;
}

export function utcIsoNow(): string {
  return new Date().toISOString();
}

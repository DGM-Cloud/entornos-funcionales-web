/** Destinatarios y remitente fijos (nunca desde el cliente). */
export const MAIL = {
  from: 'Entornos Funcionales - Notificaciones <notificaciones@entornosfuncionales.com>',
  contactoTo: 'cotizaciones@entornosfuncionales.com',
  reclamosTo: 'reclamos@entornosfuncionales.com',
} as const;

export const LIMITS = {
  /** Tamaño máximo del body JSON (bytes). */
  maxBodyBytes: 32_768,
  /** Longitudes máximas por campo de texto. */
  shortText: 120,
  mediumText: 300,
  longText: 4_000,
  email: 254,
  phone: 30,
  document: 20,
  idempotencyKey: 128,
  turnstileToken: 2_048,
} as const;

export const DEFAULT_ALLOWED_ORIGIN = 'https://entornosfuncionales.com';

export function getAllowedOrigin(env: Env): string {
  const configured = env.ALLOWED_ORIGIN?.trim();
  return configured && configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGIN;
}

export function requireSecret(
  value: string | undefined,
  name: 'RESEND_API_KEY' | 'TURNSTILE_SECRET_KEY',
): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing environment secret: ${name}`);
  }
  return value;
}

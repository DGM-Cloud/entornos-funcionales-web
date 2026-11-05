import { LIMITS } from './env';

export interface ContactoPayload {
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  partida: string;
  ubicacion: string;
  descripcion: string;
  aceptaPrivacidad: boolean;
  turnstileToken: string;
}

export interface ReclamacionPayload {
  esMenor: boolean;
  nombreApoderado: string;
  nombre: string;
  documento: string;
  telefono: string;
  domicilio: string;
  correo: string;
  tipoBien: 'Servicio' | 'Producto';
  montoReclamado: string;
  descripcionBien: string;
  tipoReclamo: 'Reclamo' | 'Queja';
  detalle: string;
  pedido: string;
  turnstileToken: string;
  idempotencyKey?: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; details: Record<string, string> };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function requireText(
  details: Record<string, string>,
  field: string,
  value: unknown,
  max: number,
  required = true,
): string {
  const text = asString(value);
  if (required && text.length === 0) {
    details[field] = 'Campo obligatorio.';
    return '';
  }
  if (text.length > max) {
    details[field] = `Máximo ${max} caracteres.`;
  }
  return text;
}

function requireEmail(details: Record<string, string>, field: string, value: unknown): string {
  const email = requireText(details, field, value, LIMITS.email, true);
  if (!email || details[field]) {
    return email;
  }
  // Validación pragmática (no RFC completo).
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!ok) {
    details[field] = 'Correo electrónico inválido.';
  }
  return email.toLowerCase();
}

export function validateContacto(input: unknown): ValidationResult<ContactoPayload> {
  if (!isPlainObject(input)) {
    return { ok: false, details: { body: 'Se esperaba un objeto JSON.' } };
  }

  const details: Record<string, string> = {};
  const value: ContactoPayload = {
    nombre: requireText(details, 'nombre', input['nombre'], LIMITS.shortText),
    empresa: requireText(details, 'empresa', input['empresa'], LIMITS.shortText),
    correo: requireEmail(details, 'correo', input['correo']),
    telefono: requireText(details, 'telefono', input['telefono'], LIMITS.phone, false),
    partida: requireText(details, 'partida', input['partida'], LIMITS.shortText),
    ubicacion: requireText(details, 'ubicacion', input['ubicacion'], LIMITS.mediumText, false),
    descripcion: requireText(details, 'descripcion', input['descripcion'], LIMITS.longText),
    aceptaPrivacidad: input['aceptaPrivacidad'] === true,
    turnstileToken: requireText(details, 'turnstileToken', input['turnstileToken'], LIMITS.turnstileToken),
  };

  if (!value.aceptaPrivacidad) {
    details['aceptaPrivacidad'] = 'Debe aceptar la política de privacidad.';
  }

  if (Object.keys(details).length > 0) {
    return { ok: false, details };
  }
  return { ok: true, value };
}

export function validateReclamacion(input: unknown): ValidationResult<ReclamacionPayload> {
  if (!isPlainObject(input)) {
    return { ok: false, details: { body: 'Se esperaba un objeto JSON.' } };
  }

  const details: Record<string, string> = {};
  const esMenor = input['esMenor'] === true || input['esMenor'] === 'true';

  const tipoBienRaw = asString(input['tipoBien']);
  if (tipoBienRaw !== 'Servicio' && tipoBienRaw !== 'Producto') {
    details['tipoBien'] = 'Debe ser Servicio o Producto.';
  }

  const tipoReclamoRaw = asString(input['tipoReclamo']);
  if (tipoReclamoRaw !== 'Reclamo' && tipoReclamoRaw !== 'Queja') {
    details['tipoReclamo'] = 'Debe ser Reclamo o Queja.';
  }

  const value: ReclamacionPayload = {
    esMenor,
    nombreApoderado: requireText(
      details,
      'nombreApoderado',
      input['nombreApoderado'],
      LIMITS.shortText,
      esMenor,
    ),
    nombre: requireText(details, 'nombre', input['nombre'], LIMITS.shortText),
    documento: requireText(details, 'documento', input['documento'], LIMITS.document),
    telefono: requireText(details, 'telefono', input['telefono'], LIMITS.phone),
    domicilio: requireText(details, 'domicilio', input['domicilio'], LIMITS.mediumText),
    correo: requireEmail(details, 'correo', input['correo']),
    tipoBien: (tipoBienRaw as 'Servicio' | 'Producto') || 'Servicio',
    montoReclamado: requireText(details, 'montoReclamado', input['montoReclamado'], LIMITS.shortText, false),
    descripcionBien: requireText(details, 'descripcionBien', input['descripcionBien'], LIMITS.mediumText),
    tipoReclamo: (tipoReclamoRaw as 'Reclamo' | 'Queja') || 'Reclamo',
    detalle: requireText(details, 'detalle', input['detalle'], LIMITS.longText),
    pedido: requireText(details, 'pedido', input['pedido'], LIMITS.longText),
    turnstileToken: requireText(details, 'turnstileToken', input['turnstileToken'], LIMITS.turnstileToken),
  };

  const idempotencyKey = asString(input['idempotencyKey']);
  if (idempotencyKey) {
    if (idempotencyKey.length > LIMITS.idempotencyKey) {
      details['idempotencyKey'] = `Máximo ${LIMITS.idempotencyKey} caracteres.`;
    } else {
      value.idempotencyKey = idempotencyKey;
    }
  }

  if (Object.keys(details).length > 0) {
    return { ok: false, details };
  }
  return { ok: true, value };
}

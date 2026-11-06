import type { ReclamacionPayload } from './validate';

/** Huella estable del contenido (sin token Turnstile ni clave de idempotencia). */
export async function hashReclamacionPayload(payload: ReclamacionPayload): Promise<string> {
  const canonical = JSON.stringify({
    esMenor: payload.esMenor,
    nombreApoderado: payload.nombreApoderado,
    nombre: payload.nombre,
    documento: payload.documento,
    telefono: payload.telefono,
    domicilio: payload.domicilio,
    correo: payload.correo,
    tipoBien: payload.tipoBien,
    montoReclamado: payload.montoReclamado,
    descripcionBien: payload.descripcionBien,
    tipoReclamo: payload.tipoReclamo,
    detalle: payload.detalle,
    pedido: payload.pedido,
  });

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

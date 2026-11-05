import { escapeHtml, escapeMultiline } from './html';
import type { ContactoPayload } from './validate';

export function buildContactoEmailHtml(payload: ContactoPayload): string {
  const rows: Array<[string, string]> = [
    ['Nombre', escapeHtml(payload.nombre)],
    ['Empresa', escapeHtml(payload.empresa)],
    ['Correo', escapeHtml(payload.correo)],
    ['Teléfono', escapeHtml(payload.telefono || '—')],
    ['Partida', escapeHtml(payload.partida)],
    ['Ubicación', escapeHtml(payload.ubicacion || '—')],
  ];

  const details = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:34%;">${label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;color:#0F172A;font-size:14px;">${value}</td>
      </tr>`,
    )
    .join('');

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#F8FAFC;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:4px;overflow:hidden;">
      <div style="background:#0B192C;padding:20px 24px;">
        <p style="margin:0;color:#94A3B8;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Entornos Funcionales</p>
        <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:20px;font-weight:600;">Nueva consulta web</h1>
      </div>
      <div style="padding:8px 12px 20px;">
        <table style="width:100%;border-collapse:collapse;">${details}</table>
        <div style="padding:16px 12px 4px;">
          <p style="margin:0 0 8px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Descripción técnica</p>
          <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.55;">${escapeMultiline(payload.descripcion)}</p>
        </div>
      </div>
      <div style="padding:14px 24px;background:#F8FAFC;border-top:1px solid #E2E8F0;">
        <p style="margin:0;color:#64748B;font-size:12px;line-height:1.5;">
          Responda a este mensaje para contactar directamente al cliente (Reply-To).
        </p>
      </div>
    </div>
  </div>`;
}

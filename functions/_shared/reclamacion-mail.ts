import { escapeHtml, escapeMultiline } from './html';
import type { ReclamacionPayload } from './validate';

export interface ReclamacionMailContext {
  codigo: string;
  createdAt: string;
  payload: ReclamacionPayload;
}

function formatFecha(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-PE', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return escapeHtml(iso);
  }
}

function dataRows(rows: Array<[string, string]>): string {
  return rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:34%;">${label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #E2E8F0;color:#0F172A;font-size:14px;">${value}</td>
      </tr>`,
    )
    .join('');
}

function shell(title: string, subtitle: string, body: string, footer: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#F8FAFC;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:4px;overflow:hidden;">
      <div style="background:#0B192C;padding:20px 24px;">
        <p style="margin:0;color:#94A3B8;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;">Entornos Funcionales S.A.C.</p>
        <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:20px;font-weight:600;">${title}</h1>
        <p style="margin:8px 0 0;color:#CBD5E1;font-size:13px;">${subtitle}</p>
      </div>
      <div style="padding:8px 12px 20px;">${body}</div>
      <div style="padding:14px 24px;background:#F8FAFC;border-top:1px solid #E2E8F0;">
        <p style="margin:0;color:#64748B;font-size:12px;line-height:1.5;">${footer}</p>
      </div>
    </div>
  </div>`;
}

function reclamanteRows(ctx: ReclamacionMailContext): Array<[string, string]> {
  const { payload, codigo, createdAt } = ctx;
  const rows: Array<[string, string]> = [
    ['Código', escapeHtml(codigo)],
    ['Fecha de registro', escapeHtml(formatFecha(createdAt))],
    ['Tipo', escapeHtml(payload.tipoReclamo)],
    ['Consumidor menor de edad', payload.esMenor ? 'Sí' : 'No'],
  ];

  if (payload.esMenor && payload.nombreApoderado) {
    rows.push(['Padre, madre o apoderado', escapeHtml(payload.nombreApoderado)]);
  }

  rows.push(
    ['Nombre del reclamante', escapeHtml(payload.nombre)],
    ['Documento', escapeHtml(payload.documento)],
    ['Teléfono', escapeHtml(payload.telefono)],
    ['Domicilio', escapeHtml(payload.domicilio)],
    ['Correo', escapeHtml(payload.correo)],
    ['Tipo de bien', escapeHtml(payload.tipoBien)],
    ['Descripción del bien', escapeHtml(payload.descripcionBien)],
    ['Monto reclamado', payload.montoReclamado ? escapeHtml(`S/ ${payload.montoReclamado}`) : '—'],
  );

  return rows;
}

/** Notificación interna a reclamos@ */
export function buildEmpresaReclamacionHtml(ctx: ReclamacionMailContext): string {
  const rows = reclamanteRows(ctx);
  const body = `
    <table style="width:100%;border-collapse:collapse;">${dataRows(rows)}</table>
    <div style="padding:16px 12px 4px;">
      <p style="margin:0 0 8px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Detalle de los hechos</p>
      <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.55;">${escapeMultiline(ctx.payload.detalle)}</p>
    </div>
    <div style="padding:16px 12px 4px;">
      <p style="margin:0 0 8px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Pedido del consumidor</p>
      <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.55;">${escapeMultiline(ctx.payload.pedido)}</p>
    </div>`;

  return shell(
    'Nueva reclamación registrada',
    `Código ${escapeHtml(ctx.codigo)}`,
    body,
    'Responda a este mensaje para contactar al reclamante (Reply-To). El registro ya está guardado en el sistema.',
  );
}

/** Constancia al consumidor. Sin afirmar resolución ni inventar plazos no verificados en código. */
export function buildConstanciaReclamacionHtml(ctx: ReclamacionMailContext): string {
  const rows = reclamanteRows(ctx);
  const body = `
    <p style="margin:12px 12px 16px;color:#0F172A;font-size:14px;line-height:1.55;">
      Confirmamos que Entornos Funcionales S.A.C. ha registrado su hoja de reclamación con el código indicado.
      Conserve este código para el seguimiento de su caso.
    </p>
    <table style="width:100%;border-collapse:collapse;">${dataRows(rows)}</table>
    <div style="padding:16px 12px 4px;">
      <p style="margin:0 0 8px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Detalle registrado</p>
      <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.55;">${escapeMultiline(ctx.payload.detalle)}</p>
    </div>
    <div style="padding:16px 12px 4px;">
      <p style="margin:0 0 8px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Pedido registrado</p>
      <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.55;">${escapeMultiline(ctx.payload.pedido)}</p>
    </div>
    <div style="padding:16px 12px 4px;">
      <p style="margin:0 0 8px;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">Seguimiento</p>
      <p style="margin:0;color:#0F172A;font-size:14px;line-height:1.55;">
        Para consultas sobre esta reclamación escriba a
        <strong>reclamos&#64;entornosfuncionales.com</strong>
        indicando el código de registro.
      </p>
    </div>`;

  return shell(
    'Constancia de reclamación',
    `Código ${escapeHtml(ctx.codigo)}`,
    body,
    'Este mensaje es una constancia de registro. No implica que la reclamación haya sido resuelta.',
  );
}

import { COMPANY_INFO } from '../legal/company-info';

export interface ReclamacionPrintData {
  codigo: string;
  fecha: string;
  esMenor: boolean;
  nombreApoderado: string;
  domicilioApoderado: string;
  telefonoApoderado: string;
  correoApoderado: string;
  nombre: string;
  documento: string;
  telefono: string;
  domicilio: string;
  correo: string;
  tipoBien: string;
  montoReclamado: string;
  descripcionBien: string;
  tipoReclamo: string;
  detalle: string;
  pedido: string;
}

function esc(value: string): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string): string {
  return `<tr><th>${esc(label)}</th><td>${esc(value || '—')}</td></tr>`;
}

/**
 * Abre una ventana con la Hoja de Reclamación e invoca la impresión nativa.
 * Usa solo datos de la sesión actual (sin endpoint público ni localStorage con PII).
 */
export function printReclamacionHoja(data: ReclamacionPrintData): void {
  const c = COMPANY_INFO;
  const apoderadoBlock = data.esMenor
    ? `
      <h2>Representante del menor</h2>
      <table>
        ${row('Nombre completo', data.nombreApoderado)}
        ${row('Domicilio', data.domicilioApoderado)}
        ${row('Teléfono', data.telefonoApoderado)}
        ${row('Correo electrónico', data.correoApoderado)}
      </table>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Hoja de Reclamación ${esc(data.codigo)}</title>
  <style>
    @page { size: A4; margin: 16mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; font-size: 12px; line-height: 1.45; margin: 0; }
    h1 { font-size: 18px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.04em; }
    h2 { font-size: 13px; margin: 18px 0 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; text-transform: uppercase; }
    .meta { color: #475569; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    th, td { text-align: left; vertical-align: top; padding: 6px 4px; border-bottom: 1px solid #e2e8f0; }
    th { width: 34%; color: #64748b; font-weight: 600; font-size: 11px; text-transform: uppercase; }
    .box { white-space: pre-wrap; border: 1px solid #e2e8f0; padding: 10px; min-height: 48px; }
    .legal { margin-top: 18px; font-size: 10px; color: #64748b; }
    .actions { margin: 16px 0; }
    @media print { .actions { display: none; } }
  </style>
</head>
<body>
  <div class="actions">
    <button onclick="window.print()">Imprimir / Guardar como PDF</button>
  </div>
  <h1>Hoja de Reclamación</h1>
  <p class="meta">Libro de Reclamaciones virtual — ${esc(c.razonSocial)}</p>

  <table>
    ${row('Proveedor', c.razonSocial)}
    ${row('RUC', c.ruc)}
    ${row('Domicilio', c.domicilio)}
    ${row('Código / N.º de hoja', data.codigo)}
    ${row('Fecha y hora de registro (Perú)', data.fecha)}
  </table>

  <h2>1. Identificación del consumidor reclamante</h2>
  <table>
    ${row('¿Menor de edad?', data.esMenor ? 'Sí' : 'No')}
    ${row('Nombre completo', data.nombre)}
    ${row('Documento de identidad', data.documento)}
    ${row('Domicilio', data.domicilio)}
    ${row('Teléfono', data.telefono)}
    ${row('Correo electrónico', data.correo)}
  </table>
  ${apoderadoBlock}

  <h2>2. Identificación del bien contratado</h2>
  <table>
    ${row('Tipo de bien', data.tipoBien)}
    ${row('Monto reclamado', data.montoReclamado ? `S/ ${data.montoReclamado}` : '—')}
    ${row('Descripción', data.descripcionBien)}
  </table>

  <h2>3. Detalle de la reclamación y pedido</h2>
  <table>
    ${row('Tipo', data.tipoReclamo)}
  </table>
  <p><strong>Detalle</strong></p>
  <div class="box">${esc(data.detalle)}</div>
  <p><strong>Pedido</strong></p>
  <div class="box">${esc(data.pedido)}</div>

  <div class="legal">
    <p>* La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>
    <p>* El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a ${esc(c.plazoAtencionReclamosLabel)}, el cual es improrrogable.</p>
    <p>* Seguimiento: ${esc(c.correoReclamosArco)} — ${esc(c.areaAdministrativa)}.</p>
    <p>* Esta hoja confirma el registro de la reclamación; no implica su resolución.</p>
  </div>
  <script>window.addEventListener('load', function () { setTimeout(function () { window.print(); }, 250); });</script>
</body>
</html>`;

  const popup = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!popup) {
    // Fallback: blob URL si el navegador bloquea ventanas.
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return;
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}

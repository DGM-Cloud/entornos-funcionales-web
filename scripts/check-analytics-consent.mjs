/**
 * Verificación aislada del consentimiento Analytics (sin navegador ni Wrangler).
 * Ejecutar: node scripts/check-analytics-consent.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svc = readFileSync(join(root, 'src/app/shared/service/analytics-consent.service.ts'), 'utf8');
const banner = readFileSync(
  join(root, 'src/app/shared/components/cookies/cookie-banner.component.ts'),
  'utf8',
);
const libro = readFileSync(
  join(root, 'src/app/shared/components/libro-reclamaciones/libro-reclamaciones.component.ts'),
  'utf8',
);
const print = readFileSync(join(root, 'src/app/shared/utils/reclamacion-print.ts'), 'utf8');

function must(label, cond, detail) {
  if (!cond) throw new Error(`[${label}] ${detail}`);
}

must('storage', svc.includes("ef_analytics_consent"), 'clave de preferencia');
must('accept', svc.includes('persist(\'accepted\')') && svc.includes('loadAnalytics()'), 'aceptación carga beacon');
must('reject', svc.includes('persist(\'rejected\')') && svc.includes('unloadAnalytics()'), 'rechazo descarga beacon');
must('reload', svc.includes('window.location.reload()'), 'recarga tras aceptar→rechazar');
must('legacy', svc.includes('cookiesAccepted') && svc.includes('removeItem(LEGACY_KEY)'), 'no hereda aceptación legacy');
must('script', svc.includes('cf-web-analytics-beacon') && svc.includes('beacon.min.js'), 'script condicional');
must('banner', banner.includes('analytics.accept()') && banner.includes('analytics.reject()'), 'botones Aceptar/Rechazar');
must('banner-text', !banner.includes('Al continuar navegando'), 'sin consentimiento implícito');
must('print-mem', libro.includes('hojaPrint.set') && !/localStorage\.(setItem|getItem)/.test(libro), 'impresión en memoria');
must('print-no-ls', !/localStorage\.(setItem|getItem)/.test(print), 'print util sin localStorage');
must('print-no-api', print.includes('sin endpoint público'), 'sin endpoint público');

console.log('OK — Analytics (aceptar/rechazar/carga condicional) e impresión/privacidad coherentes en código');

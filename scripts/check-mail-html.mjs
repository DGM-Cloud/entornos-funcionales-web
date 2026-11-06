/**
 * Verificación local de plantillas de correo (sin Resend real).
 * Ejecutar: node scripts/check-mail-html.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const mailSrc = readFileSync(join(root, 'functions/_shared/reclamacion-mail.ts'), 'utf8');
const companySrc = readFileSync(join(root, 'functions/_shared/company.ts'), 'utf8');
const printSrc = readFileSync(join(root, 'src/app/shared/utils/reclamacion-print.ts'), 'utf8');
const libroSrc = readFileSync(
  join(root, 'src/app/shared/components/libro-reclamaciones/libro-reclamaciones.component.ts'),
  'utf8',
);

function assertIncludes(label, haystack, needles) {
  for (const n of needles) {
    if (!haystack.includes(n)) {
      throw new Error(`[${label}] falta: ${n}`);
    }
  }
}

assertIncludes('company', companySrc, [
  'Entornos Funcionales S.A.C.',
  '20613342002',
  'Flor de Amancaes',
  'reclamos@entornosfuncionales.com',
]);

assertIncludes('reclamacion-mail', mailSrc, [
  'COMPANY.razonSocial',
  'COMPANY.ruc',
  'COMPANY.domicilio',
  'Código / N.º de hoja',
  'Padre, madre o representante',
  'Domicilio del representante',
  'Teléfono del representante',
  'Correo del representante',
  'plazoAtencionReclamos',
  'No implica que la reclamación haya sido resuelta',
]);

assertIncludes('print', printSrc, [
  'Hoja de Reclamación',
  'Código / N.º de hoja',
  'Representante del menor',
  'sin endpoint público ni localStorage con PII',
  'plazoAtencionReclamosLabel',
]);

assertIncludes('libro', libroSrc, [
  'hojaPrint',
  'printReclamacionHoja',
  'Imprimir / Guardar como PDF',
  'domicilioApoderado',
  'telefonoApoderado',
  'correoApoderado',
]);

if (/localStorage\.(setItem|getItem)/.test(libroSrc)) {
  throw new Error('El Libro no debe persistir datos en localStorage');
}

if (/localStorage\.(setItem|getItem)/.test(printSrc)) {
  throw new Error('reclamacion-print no debe usar localStorage');
}

console.log('OK — plantillas de correo, constancia e impresión contienen correlativo/representante/privacidad esperados');

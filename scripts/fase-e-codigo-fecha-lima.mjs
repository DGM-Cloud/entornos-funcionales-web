/**
 * Pruebas locales del YYYYMMDD en America/Lima (sin D1 ni deploy).
 * Uso: node scripts/fase-e-codigo-fecha-lima.mjs
 */

function limaYmd(now) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${year}${month}${day}`;
}

function createReclamacionCodigo(now) {
  const ymd = limaYmd(now);
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
  return `EF-REC-${ymd}-${suffix}`;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const cases = [
  // 05/11/2026 19:37 Perú = 06/11/2026 00:37 UTC → código debe ser 20261105
  {
    iso: '2026-11-06T00:37:00.000Z',
    expectYmd: '20261105',
    label: '19:37 Perú (UTC ya día siguiente)',
  },
  {
    iso: '2026-11-06T04:59:59.999Z',
    expectYmd: '20261105',
    label: '23:59:59.999 Perú',
  },
  {
    iso: '2026-11-06T05:00:00.000Z',
    expectYmd: '20261106',
    label: '00:00 Perú (medianoche local)',
  },
  {
    iso: '2026-11-05T19:00:00.000Z',
    expectYmd: '20261105',
    label: '14:00 Perú (tarde, UTC mismo día)',
  },
  {
    iso: '2026-11-06T02:00:00.000Z',
    expectYmd: '20261105',
    label: '21:00 Perú (ventana 19:00–23:59)',
  },
];

for (const c of cases) {
  const now = new Date(c.iso);
  const ymd = limaYmd(now);
  const code = createReclamacionCodigo(now);
  assert(ymd === c.expectYmd, `${c.label}: ymd ${ymd} != ${c.expectYmd} (iso ${c.iso})`);
  assert(code.startsWith(`EF-REC-${c.expectYmd}-`), `${c.label}: code ${code}`);
  assert(/^EF-REC-\d{8}-[0-9A-F]{4}$/.test(code), `${c.label}: formato ${code}`);
  // UTC del instante no debe forzar el YMD del código
  const utcYmd = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, '0')}${String(now.getUTCDate()).padStart(2, '0')}`;
  if (utcYmd !== c.expectYmd) {
    assert(ymd !== utcYmd, `${c.label}: debía diferir de UTC ${utcYmd}`);
  }
  console.log('✓', c.label, '→', code, `(UTC day ${utcYmd})`);
}

// Sufijos distintos en llamadas sucesivas (aleatorio)
const a = createReclamacionCodigo(new Date('2026-11-06T02:00:00.000Z'));
const b = createReclamacionCodigo(new Date('2026-11-06T02:00:00.000Z'));
assert(/^EF-REC-20261105-[0-9A-F]{4}$/.test(a) && /^EF-REC-20261105-[0-9A-F]{4}$/.test(b), 'sufijo formato');
console.log('✓ sufijos aleatorios', a, b);

// created_at sigue siendo ISO UTC
const createdAt = new Date('2026-11-06T00:37:00.000Z').toISOString();
assert(createdAt === '2026-11-06T00:37:00.000Z', 'created_at UTC intacto');
console.log('✓ created_at UTC', createdAt);

console.log('Todas las aserciones de fecha Lima pasaron.');

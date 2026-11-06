/**
 * Pruebas locales de POST /api/reclamaciones (requiere wrangler pages dev activo).
 * Uso: node scripts/fase-d-local-api-tests.mjs [baseUrl]
 */

const baseUrl = (process.argv[2] || 'http://127.0.0.1:8799').replace(/\/$/, '');

function samplePayload(overrides = {}) {
  return {
    esMenor: false,
    nombreApoderado: '',
    nombre: 'Consumidor de Prueba',
    documento: '12345678',
    telefono: '999888777',
    domicilio: 'Av. Ejemplo 123, Lima',
    correo: 'consumidor.prueba@example.com',
    tipoBien: 'Servicio',
    montoReclamado: '150.50',
    descripcionBien: 'Instalación drywall oficina',
    tipoReclamo: 'Reclamo',
    detalle: 'El servicio no se completó en la fecha acordada.',
    pedido: 'Culminar la obra y emitir conformidad.',
    turnstileToken: 'test-token-local',
    ...overrides,
  };
}

async function postReclamacion(body, idempotencyKey, method = 'POST', extraHeaders = {}) {
  const response = await fetch(`${baseUrl}/api/reclamaciones`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      ...extraHeaders,
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: response.status, json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const results = [];

  {
    const r = await postReclamacion(samplePayload(), crypto.randomUUID(), 'GET');
    assert(r.status === 405, `GET esperado 405, got ${r.status}`);
    results.push('GET → 405');
  }

  {
    const r = await postReclamacion({}, crypto.randomUUID());
    assert(r.status === 400, `vacío esperado 400, got ${r.status}`);
    results.push('payload vacío → 400');
  }

  {
    const r = await postReclamacion(samplePayload(), 'clave-debil');
    assert(r.status === 400, `clave débil esperado 400, got ${r.status}`);
    results.push('idempotency débil → 400');
  }

  {
    const r = await postReclamacion(
      samplePayload({ turnstileToken: 'invalid' }),
      crypto.randomUUID(),
    );
    assert(r.status === 403, `turnstile invalid esperado 403, got ${r.status}`);
    results.push('turnstile invalid → 403');
  }

  const keyOk = crypto.randomUUID();
  let codigo;
  {
    const r = await postReclamacion(samplePayload(), keyOk);
    assert(r.status === 200 && r.json?.ok === true, `alta esperada 200, got ${r.status}`);
    assert(r.json.data?.codigo, 'falta codigo');
    assert(!r.json.data?.nombre && !r.json.data?.correo, 'no debe filtrar PII');
    codigo = r.json.data.codigo;
    results.push(`alta → 200 ${codigo}`);
  }

  {
    const r = await postReclamacion(samplePayload(), keyOk);
    assert(r.status === 200, `idempotente esperado 200, got ${r.status}`);
    assert(r.json.data?.codigo === codigo, 'codigo distinto');
    assert(r.json.data?.reused === true, 'reused esperado');
    results.push('idempotencia mismo contenido → mismo codigo');
  }

  {
    const r = await postReclamacion(
      samplePayload({ detalle: 'Contenido distinto del original' }),
      keyOk,
    );
    assert(r.status === 409, `conflicto esperado 409, got ${r.status}`);
    assert(!String(JSON.stringify(r.json)).includes('Consumidor de Prueba'), '409 sin PII');
    results.push('idempotencia contenido distinto → 409 sin PII');
  }

  {
    const r = await postReclamacion(
      samplePayload({ esMenor: true, nombreApoderado: '' }),
      crypto.randomUUID(),
    );
    assert(r.status === 400, `menor sin apoderado esperado 400, got ${r.status}`);
    results.push('menor sin apoderado → 400');
  }

  {
    const r = await postReclamacion(samplePayload({ montoReclamado: '-10' }), crypto.randomUUID());
    assert(r.status === 400, `monto inválido esperado 400, got ${r.status}`);
    results.push('monto inválido → 400');
  }

  {
    const r = await postReclamacion(samplePayload({ tipoReclamo: 'Otro' }), crypto.randomUUID());
    assert(r.status === 400, `tipo inválido esperado 400, got ${r.status}`);
    results.push('tipo reclamo inválido → 400');
  }

  {
    const huge = samplePayload({ detalle: 'x'.repeat(50_000) });
    const r = await postReclamacion(huge, crypto.randomUUID());
    assert(r.status === 413 || r.status === 400, `payload grande esperado 413/400, got ${r.status}`);
    results.push(`payload excesivo → ${r.status}`);
  }

  // Cabecera X-Resend-Mock-Mode no debe alterar el comportamiento.
  {
    const r = await postReclamacion(samplePayload(), crypto.randomUUID(), 'POST', {
      'X-Resend-Mock-Mode': 'fail_both',
    });
    assert(r.status === 200 && r.json?.ok === true, `header mock no debe romper alta, got ${r.status}`);
    assert(
      r.json.data?.mail?.overall === 'sent',
      `header mock no debe forzar fallo; overall=${r.json.data?.mail?.overall}`,
    );
    results.push('X-Resend-Mock-Mode ignorada → sent con mock env success');
  }

  // Concurrencia: un código; claim debe evitar doble envío (verificado vía un solo registro).
  {
    const key = crypto.randomUUID();
    const body = samplePayload({ correo: 'concurrente2@example.com', detalle: 'Concurrente claim' });
    const reqs = Array.from({ length: 5 }, () => postReclamacion(body, key));
    const outs = await Promise.all(reqs);
    const codes = [...new Set(outs.map((o) => o.json?.data?.codigo).filter(Boolean))];
    assert(outs.every((o) => o.status === 200), 'concurrencia statuses');
    assert(codes.length === 1, `concurrencia códigos únicos got ${codes.length}`);
    results.push(`concurrencia 5× → 1 codigo ${codes[0]}`);
  }

  // Contacto no debe romperse por cambios compartidos (sin secret → 503 turnstile).
  {
    const r = await fetch(`${baseUrl}/api/contacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        nombre: 'a',
        empresa: 'b',
        correo: 'a@b.com',
        telefono: '',
        partida: 'x',
        ubicacion: '',
        descripcion: 'desc',
        aceptaPrivacidad: true,
        turnstileToken: 'x',
      }),
    });
    assert(r.status === 503 || r.status === 403 || r.status === 502, `contacto local esperado 503/403/502, got ${r.status}`);
    results.push(`contacto compartido intacto → ${r.status}`);
  }

  console.log('Auditoría Fase D — pruebas API:');
  for (const line of results) {
    console.log('  ✓', line);
  }
  console.log('Todas las aserciones pasaron.');
}

main().catch((err) => {
  console.error('FALLO:', err.message);
  process.exit(1);
});

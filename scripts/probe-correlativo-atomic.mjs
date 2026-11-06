/**
 * Prueba aislada (node:sqlite, sin Wrangler) de patrones atómicos allocate+INSERT.
 * Uso: node scripts/probe-correlativo-atomic.mjs
 */
import { DatabaseSync } from 'node:sqlite';

function setup() {
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE reclamacion_secuencia (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      ultimo INTEGER NOT NULL CHECK (ultimo >= 0)
    );
    INSERT INTO reclamacion_secuencia (id, ultimo) VALUES (1, 0);
    CREATE TABLE reclamaciones (
      id TEXT PRIMARY KEY NOT NULL,
      codigo TEXT NOT NULL UNIQUE,
      idempotency_key TEXT UNIQUE
    );
  `);
  return db;
}

function report(name, ok, detail = '') {
  console.log(`${ok ? 'OK' : 'FAIL'} — ${name}${detail ? `: ${detail}` : ''}`);
}

function runTx(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    fn();
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}

// A) CTE writable — no soportado en este SQLite
{
  const db = setup();
  try {
    db.prepare(
      `WITH allocated AS (
         UPDATE reclamacion_secuencia
         SET ultimo = ultimo + 1
         WHERE id = 1
         RETURNING ultimo
       )
       INSERT INTO reclamaciones (id, codigo, idempotency_key)
       SELECT 'a1', printf('EF-%06d', ultimo), 'k1' FROM allocated`,
    ).run();
    report('CTE UPDATE RETURNING + INSERT', true, 'soportado');
  } catch (e) {
    report('CTE UPDATE RETURNING + INSERT', false, e.message);
  }
}

// B) TX equivalente a D1.batch(): UPDATE + INSERT(subquery del mismo ultimo)
{
  const db = setup();
  runTx(db, () => {
    db.prepare(
      `UPDATE reclamacion_secuencia SET ultimo = ultimo + 1 WHERE id = 1`,
    ).run();
    db.prepare(
      `INSERT INTO reclamaciones (id, codigo, idempotency_key)
       VALUES (
         'b1',
         (SELECT printf('EF-%06d', ultimo) FROM reclamacion_secuencia WHERE id = 1),
         'kb1'
       )`,
    ).run();
  });
  const row = db.prepare('SELECT codigo FROM reclamaciones WHERE id = ?').get('b1');
  const seq = db.prepare('SELECT ultimo FROM reclamacion_secuencia WHERE id = 1').get();
  report(
    'TX UPDATE + INSERT(subquery) éxito',
    row?.codigo === 'EF-000001' && seq?.ultimo === 1,
    JSON.stringify({ row, seq }),
  );
}

// C) UNIQUE idempotency revierte secuencia en la misma TX
{
  const db = setup();
  db.prepare(
    `INSERT INTO reclamaciones (id, codigo, idempotency_key) VALUES ('x','EF-HOLD','k-dup')`,
  ).run();
  try {
    runTx(db, () => {
      db.prepare(
        `UPDATE reclamacion_secuencia SET ultimo = ultimo + 1 WHERE id = 1`,
      ).run();
      db.prepare(
        `INSERT INTO reclamaciones (id, codigo, idempotency_key)
         VALUES (
           'b2',
           (SELECT printf('EF-%06d', ultimo) FROM reclamacion_secuencia WHERE id = 1),
           'k-dup'
         )`,
      ).run();
    });
    report('TX rollback UNIQUE idempotency', false, 'no falló');
  } catch {
    const seq = db.prepare('SELECT ultimo FROM reclamacion_secuencia WHERE id = 1').get();
    const inserted = db
      .prepare(`SELECT COUNT(*) AS c FROM reclamaciones WHERE id = 'b2'`)
      .get();
    report(
      'TX rollback UNIQUE idempotency',
      seq?.ultimo === 0 && inserted?.c === 0,
      JSON.stringify({ seq, inserted }),
    );
  }
}

// D–F) reclaimTip atómico
{
  const db = setup();
  db.prepare(`UPDATE reclamacion_secuencia SET ultimo = 2 WHERE id = 1`).run();
  db.prepare(
    `INSERT INTO reclamaciones (id, codigo, idempotency_key) VALUES ('b','EF-000002','kb')`,
  ).run();
  const r = db
    .prepare(
      `UPDATE reclamacion_secuencia
       SET ultimo = ultimo - 1
       WHERE id = 1
         AND ultimo = ?
         AND NOT EXISTS (SELECT 1 FROM reclamaciones WHERE codigo = ?)`,
    )
    .run(1, 'EF-000001');
  const seq = db.prepare('SELECT ultimo FROM reclamacion_secuencia WHERE id = 1').get();
  report(
    'reclaim atómico no baja si no es punta',
    r.changes === 0 && seq?.ultimo === 2,
    JSON.stringify({ changes: r.changes, seq }),
  );
}

{
  const db = setup();
  db.prepare(`UPDATE reclamacion_secuencia SET ultimo = 1 WHERE id = 1`).run();
  db.prepare(
    `INSERT INTO reclamaciones (id, codigo, idempotency_key) VALUES ('c','EF-000001','kc')`,
  ).run();
  const r = db
    .prepare(
      `UPDATE reclamacion_secuencia
       SET ultimo = ultimo - 1
       WHERE id = 1
         AND ultimo = ?
         AND NOT EXISTS (SELECT 1 FROM reclamaciones WHERE codigo = ?)`,
    )
    .run(1, 'EF-000001');
  const seq = db.prepare('SELECT ultimo FROM reclamacion_secuencia WHERE id = 1').get();
  report(
    'reclaim atómico no reutiliza confirmado',
    r.changes === 0 && seq?.ultimo === 1,
    JSON.stringify({ changes: r.changes, seq }),
  );
}

{
  const db = setup();
  db.prepare(`UPDATE reclamacion_secuencia SET ultimo = 3 WHERE id = 1`).run();
  const r = db
    .prepare(
      `UPDATE reclamacion_secuencia
       SET ultimo = ultimo - 1
       WHERE id = 1
         AND ultimo = ?
         AND NOT EXISTS (SELECT 1 FROM reclamaciones WHERE codigo = ?)`,
    )
    .run(3, 'EF-000003');
  const seq = db.prepare('SELECT ultimo FROM reclamacion_secuencia WHERE id = 1').get();
  report(
    'reclaim atómico recupera punta huérfana',
    r.changes === 1 && seq?.ultimo === 2,
    JSON.stringify({ changes: r.changes, seq }),
  );
}

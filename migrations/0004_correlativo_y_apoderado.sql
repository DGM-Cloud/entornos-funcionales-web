-- Correlativo público EF-000001 + datos del representante del menor.
-- Aditiva: no destruye ni reinicia la tabla reclamaciones.
-- Aplicar solo en local hasta autorización remota:
--   npx wrangler d1 migrations apply entornos-funcionales-reclamos --local
--
-- Antes de aplicar en remoto: verificar que no existan reclamaciones reales
-- o que el valor inicial de `ultimo` no colisione con códigos ya asignados.
-- Con D1 vacía, el inicio en 0 produce EF-000001 en el primer INSERT.

CREATE TABLE IF NOT EXISTS reclamacion_secuencia (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  ultimo INTEGER NOT NULL CHECK (ultimo >= 0)
);

INSERT OR IGNORE INTO reclamacion_secuencia (id, ultimo) VALUES (1, 0);

ALTER TABLE reclamaciones
  ADD COLUMN domicilio_apoderado TEXT;

ALTER TABLE reclamaciones
  ADD COLUMN telefono_apoderado TEXT;

ALTER TABLE reclamaciones
  ADD COLUMN correo_apoderado TEXT;

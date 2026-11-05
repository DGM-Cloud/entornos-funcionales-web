-- Libro de reclamaciones — esquema inicial (D1 / SQLite)
-- Aplicar solo en local durante B2:
--   npx wrangler d1 migrations apply entornos-funcionales-reclamos --local

CREATE TABLE IF NOT EXISTS reclamaciones (
  id TEXT PRIMARY KEY NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  idempotency_key TEXT UNIQUE,

  es_menor INTEGER NOT NULL DEFAULT 0 CHECK (es_menor IN (0, 1)),
  nombre_apoderado TEXT,

  nombre TEXT NOT NULL,
  documento TEXT NOT NULL,
  telefono TEXT NOT NULL,
  domicilio TEXT NOT NULL,
  correo TEXT NOT NULL,

  tipo_bien TEXT NOT NULL CHECK (tipo_bien IN ('Servicio', 'Producto')),
  monto_reclamado TEXT,
  descripcion_bien TEXT NOT NULL,

  tipo_reclamo TEXT NOT NULL CHECK (tipo_reclamo IN ('Reclamo', 'Queja')),
  detalle TEXT NOT NULL,
  pedido TEXT NOT NULL,

  -- pending: recién insertada
  -- sent: empresa + constancia enviadas
  -- mail_pending: guardada pero falló el/los envíos
  -- partial: solo una de las notificaciones se completó
  mail_status TEXT NOT NULL CHECK (
    mail_status IN ('pending', 'sent', 'mail_pending', 'partial')
  ),
  mail_empresa_at TEXT,
  mail_constancia_at TEXT,
  mail_last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_reclamaciones_created_at
  ON reclamaciones (created_at);

CREATE INDEX IF NOT EXISTS idx_reclamaciones_mail_status
  ON reclamaciones (mail_status);

CREATE INDEX IF NOT EXISTS idx_reclamaciones_codigo
  ON reclamaciones (codigo);

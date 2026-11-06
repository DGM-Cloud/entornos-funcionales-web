-- Estados de notificación por canal + huella de contenido para idempotencia estricta.
-- Aplicar solo en local hasta autorización remota:
--   npx wrangler d1 migrations apply entornos-funcionales-reclamos --local

ALTER TABLE reclamaciones
  ADD COLUMN content_hash TEXT;

ALTER TABLE reclamaciones
  ADD COLUMN mail_empresa_status TEXT NOT NULL DEFAULT 'pending';

ALTER TABLE reclamaciones
  ADD COLUMN mail_constancia_status TEXT NOT NULL DEFAULT 'pending';

-- Backfill de filas previas (si existieran en local)
UPDATE reclamaciones
SET content_hash = COALESCE(content_hash, 'legacy-' || id)
WHERE content_hash IS NULL;

CREATE INDEX IF NOT EXISTS idx_reclamaciones_idempotency
  ON reclamaciones (idempotency_key);

CREATE INDEX IF NOT EXISTS idx_reclamaciones_mail_empresa_status
  ON reclamaciones (mail_empresa_status);

CREATE INDEX IF NOT EXISTS idx_reclamaciones_mail_constancia_status
  ON reclamaciones (mail_constancia_status);

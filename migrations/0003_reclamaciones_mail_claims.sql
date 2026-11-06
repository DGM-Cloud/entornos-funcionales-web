-- Bloqueo optimista por canal de correo + contadores de intento.
-- Aplicar solo en local hasta autorización remota:
--   npx wrangler d1 migrations apply entornos-funcionales-reclamos --local

ALTER TABLE reclamaciones
  ADD COLUMN mail_empresa_attempts INTEGER NOT NULL DEFAULT 0;

ALTER TABLE reclamaciones
  ADD COLUMN mail_constancia_attempts INTEGER NOT NULL DEFAULT 0;

ALTER TABLE reclamaciones
  ADD COLUMN mail_empresa_claim_at TEXT;

ALTER TABLE reclamaciones
  ADD COLUMN mail_constancia_claim_at TEXT;

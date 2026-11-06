# Fase D — Recuperación manual de notificaciones pendientes

No existe un endpoint público para consultar o reenviar reclamaciones.
No hay cron ni cola automática en esta fase.
No se afirma entrega exactamente-una-vez.

## Estados por canal

| Estado | Significado |
|---|---|
| `pending` | Aún no se intentó el envío |
| `sending` | Claim activo: un worker está enviando (o quedó huérfano) |
| `sent` | Resend aceptó y D1 confirmó el estado |
| `failed` | Intento fallido registrado en D1 |

Campos auxiliares: `mail_*_attempts`, `mail_*_claim_at`, `mail_last_error`.

Límites del API público (`POST /api/reclamaciones`):

- Máximo **3** intentos por canal.
- Cooldown **60 s** entre reintentos.
- Claim atómico: dos solicitudes concurrentes no deberían reclamar el mismo canal.
- Un `sending` más antiguo que **5 min** puede reclamarse de nuevo (posible duplicado si Resend ya aceptó).

## 1. Identificar pendientes (operador autorizado)

Local:

```bash
npx wrangler d1 execute entornos-funcionales-reclamos --local --command "SELECT codigo, created_at, mail_status, mail_empresa_status, mail_constancia_status, mail_empresa_attempts, mail_constancia_attempts, mail_empresa_claim_at, mail_constancia_claim_at, mail_last_error FROM reclamaciones WHERE mail_status IN ('mail_pending','partial','pending') OR mail_empresa_status IN ('failed','sending','pending') OR mail_constancia_status IN ('failed','sending','pending') ORDER BY created_at DESC LIMIT 50;"
```

Producción (solo tras autorización expresa):

```bash
npx wrangler d1 execute entornos-funcionales-reclamos --remote --command "SELECT codigo, created_at, mail_status, mail_empresa_status, mail_constancia_status, mail_empresa_attempts, mail_constancia_attempts, mail_last_error FROM reclamaciones WHERE mail_status IN ('mail_pending','partial','pending') ORDER BY created_at DESC LIMIT 50;"
```

No seleccionar ni volcar en tickets columnas con PII (`nombre`, `documento`, `correo`, etc.) salvo necesidad estricta y canal seguro.

## 2. Diferenciar canales

- `mail_empresa_status` → notificación a `reclamos@entornosfuncionales.com`
- `mail_constancia_status` → constancia al consumidor
- Reintentar **solo** el canal que no esté en `sent`

## 3. Antes de reintentar: incertidumbre Resend

Si el canal está en `sending` o el fallo fue tras un timeout/`upstream_error`:

1. Buscar en el panel de Resend por asunto (`Nueva reclamación - CODIGO` / `Constancia de reclamación - CODIGO`) y franja horaria.
2. **Si el correo ya aparece como enviado en Resend:** no reenviar. Marcar D1 como `sent` manualmente (ver §5).
3. **Si no hay evidencia de envío:** se puede reintentar con precaución.

Sin esta comprobación, un reintento puede generar **una constancia o aviso duplicado**.

## 4. Reintento seguro (sin endpoint público)

### Opción A — Reintento del cliente (acotado)

Si el navegador reenvía la misma `Idempotency-Key` (UUID) con el **mismo** contenido:

- No crea otro registro.
- No exige un Turnstile nuevo.
- Solo intenta canales ≠ `sent`, sujeto a claim + cooldown + máximo de intentos.
- Respuesta pública: `codigo`, `createdAt`, estados de correo (sin PII).

Contenido distinto con la misma clave → `409`.

### Opción B — Procedimiento operador (manual)

1. Confirmar en Resend que el canal pendiente **no** fue enviado (§3).
2. Si hace falta reenviar: usar un script interno futuro con secretos (no Pages público), o un reintento controlado del flujo A si se conserva la clave y el payload.
3. Tras el envío, verificar D1 (`mail_*_status`, `mail_*_at`, `mail_last_error`).
4. La fila original de la reclamación **no se borra ni se modifica** en datos del consumidor.

## 5. Corregir D1 cuando Resend ya entregó pero el UPDATE falló

Ejemplo (solo operador, tras verificar Resend):

```bash
npx wrangler d1 execute entornos-funcionales-reclamos --remote --command "UPDATE reclamaciones SET mail_constancia_status='sent', mail_constancia_at=datetime('now'), mail_status=CASE WHEN mail_empresa_status='sent' THEN 'sent' ELSE 'partial' END, mail_last_error=NULL WHERE codigo='EF-REC-YYYYMMDD-XXXX' AND mail_constancia_status='sending';"
```

Adaptar empresa/constancia según el caso. No ejecutar sin verificación previa en Resend.

## 6. Limitaciones explícitas

- No hay recuperación automática.
- No hay exactamente-una-vez extremo a extremo.
- Agotar los 3 intentos deja el canal en `failed`/`sending` hasta intervención manual.
- `RESEND_MOCK_MODE` solo aplica sin `RESEND_API_KEY`; nunca configurar mock en Production.

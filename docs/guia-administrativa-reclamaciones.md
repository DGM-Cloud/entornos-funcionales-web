# Guía operativa — Área Administrativa (reclamaciones y datos personales)

Documento interno. No sustituye asesoría legal ni un panel administrativo.

## Canales

| Canal | Uso |
|---|---|
| `reclamos@entornosfuncionales.com` | Reclamos/quejas del Libro de Reclamaciones y solicitudes de derechos sobre datos personales (ARCO y demás aplicables) |
| `cotizaciones@entornosfuncionales.com` | Consultas comerciales (no es el canal de resolución de reclamos) |
| `notificaciones@entornosfuncionales.com` | Remitente técnico de constancias y avisos |

**Responsable:** Área Administrativa.

## Procedimiento de atención de reclamos / quejas

1. Recibir el correo de nueva reclamación (asunto con código `EF-XXXXXX`).
2. Identificar el caso por el **código correlativo** (no por el UUID interno).
3. Revisar los datos registrados en el correo y, si es necesario, en D1 (acceso restringido a personal autorizado).
4. Evaluar el caso y preparar la respuesta.
5. Responder al consumidor **dentro de quince (15) días hábiles improrrogables** (art. 24.1 de la Ley N.º 29571, modificado por la Ley N.º 31435), preferentemente al correo declarado, dejando constancia.
6. Conservar reclamación, respuesta y evidencias.
7. Revisar periódicamente la información conservada según la política operativa de conservación.

### Importante

- El estado de envío de correo en D1 (`sent`, `failed`, `partial`, etc.) **no equivale** al estado de resolución del reclamo.
- Una constancia enviada solo confirma el **registro**, no la solución del caso.
- Si el correo al consumidor falló pero el registro existe, el consumidor puede haber impreso la hoja en la misma sesión; aún así conviene contactarlo por otros medios disponibles si es necesario.

## Solicitudes de protección de datos

Al recibir un mensaje en `reclamos@`:

1. Distinguir si es reclamación de consumo o ejercicio de derechos sobre datos personales.
2. Identificar al titular y el derecho solicitado.
3. Atender conforme a la normativa peruana vigente (Ley N.º 29733 y D. S. N.º 016-2024-JUS).
4. Conservar la solicitud y la respuesta.

## Conservación (política operativa)

| Tipo | Criterio operativo |
|---|---|
| Reclamaciones | Mínimo 2 años, sin perjuicio de obligaciones o controversias mayores |
| Consultas de contacto | 12 meses, salvo relación contractual u otra justificación |

La eliminación es **manual**. No hay cron ni borrado automático.

## Recuperación técnica de correos

Ver `docs/fase-d-recuperacion-correos.md` para estados de correo y reintentos. Esa guía es técnica; esta es operativa de negocio.

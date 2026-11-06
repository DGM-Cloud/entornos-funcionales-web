# Pasos exactos — Cloudflare Web Analytics en modo instalación manual

La app Angular carga el beacon **solo** tras `ef_analytics_consent=accepted` (`id="cf-web-analytics-beacon"`).

Si Pages/Web Analytics sigue inyectando el script automáticamente, el consentimiento **no** es efectivo aunque el banner funcione en el código.

Token configurado en el repo (público, no secreto):

`src/environments/environment.ts` → `cloudflareWebAnalyticsToken`

---

## Objetivo

1. Dejar de inyectar el beacon en el HTML en el edge.
2. Mantener el sitio medible solo cuando Angular inserte el snippet tras aceptación.
3. Redeployar para que el cambio aplique a un deployment nuevo.

---

## Ruta A — Web Analytics del hostname (recomendada)

1. Abra [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Vaya a **Analytics & Logs** → **Web Analytics**.
3. En la lista de sitios, localice `entornosfuncionales.com` (o el hostname del proyecto).
4. Pulse **Manage site** (Administrar sitio).
5. En la configuración de instalación / setup:
   - Elija **Enable with JS Snippet installation** (habilitar con instalación del snippet JS), **o**
   - Si prefiere apagar la medición hasta el snippet de Angular: **Disable** y luego vuelva a habilitar solo con snippet manual.
6. Copie o confirme el **Site token** / token del sitio.
7. Verifique que coincide con `cloudflareWebAnalyticsToken` en `environment.ts`.
   - Si difiere, actualice `environment.ts` **antes** del deploy (requiere su autorización de commit).
8. Guarde los cambios.

## Ruta B — Proyecto Cloudflare Pages

1. Dashboard → **Workers & Pages**.
2. Abra el proyecto de esta web (p. ej. `entornos-funcionales-web`).
3. Vaya a **Metrics** (o la sección **Web Analytics** del proyecto).
4. Si Web Analytics está en modo automático para Pages, desactívelo o cambie a instalación manual del JS snippet (misma lógica que la Ruta A).
5. Confirme el token del sitio.

> Nota: la opción exacta del UI puede etiquetarse como *JS Snippet*, *Manual setup* o *Enable with JS Snippet installation*. Lo importante es que **Cloudflare deje de inyectar** `static.cloudflareinsights.com/beacon.min.js` en el HTML.

---

## Redeploy obligatorio

La inyección automática queda ligada al **deployment**. Desactivar en el dashboard **no** limpia deployments antiguos.

1. Tras cambiar a modo manual/disable auto, autorice un **nuevo deploy** (push o `wrangler pages deploy`).
2. Redeploy también branches de preview si las usa.
3. Espere a que el deployment nuevo esté activo en producción.

## Verificación post-deploy (checklist)

Sin haber aceptado el banner (ventana privada / borrar `localStorage`):

1. Abra `https://entornosfuncionales.com/`.
2. Inspeccione el HTML / red: **no** debe existir `cloudflareinsights.com/beacon.min.js` inyectado por Cloudflare.
3. En consola: `document.querySelectorAll('script[src*="cloudflareinsights"]').length` → `0`.
4. Pulse **Aceptar** en el banner.
5. Debe aparecer `<script id="cf-web-analytics-beacon" …>`.
6. Recargue: el beacon debe seguir presente (`ef_analytics_consent=accepted`).
7. Desde Privacidad → gestionar preferencias → **Rechazar**: la página recarga y el beacon no debe volver a cargarse.
8. Confirme Turnstile en `/contacto` y `/libro-reclamaciones` con analítica rechazada.

Hasta completar estos pasos, **no** considerar aprobado el control de consentimiento en producción.

## Lo que este agente no hará sin autorización

- Modificar el dashboard de Cloudflare.
- Deploy / push.
- Afirmar cumplimiento de consentimiento en producción sin la verificación anterior.

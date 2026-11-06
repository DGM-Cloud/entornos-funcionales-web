/**
 * Configuración pública del frontend.
 * turnstileSiteKey y cloudflareWebAnalyticsToken son identificadores públicos.
 * NUNCA colocar aquí RESEND_API_KEY ni TURNSTILE_SECRET_KEY.
 *
 * cloudflareWebAnalyticsToken: token del sitio en Web Analytics (no es secreto).
 * La inyección automática del dashboard debe desactivarse para que el
 * consentimiento controle realmente la carga del beacon.
 */
export const environment = {
  production: true,
  apiBaseUrl: '',
  turnstileSiteKey: '0x4AAAAAAF1TX4qo1gaSzeDc',
  cloudflareWebAnalyticsToken: 'a3024c4ffcdd455594febf275a21f167',
};

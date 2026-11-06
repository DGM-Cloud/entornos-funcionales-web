/**
 * Mock de Resend / Turnstile para pruebas locales.
 *
 * Regla: si `RESEND_MOCK_MODE` tiene un valor reconocido, el mock está activo.
 * NUNCA configurar RESEND_MOCK_MODE en Cloudflare Pages Production/Preview.
 * La cabecera del cliente NUNCA activa el mock.
 *
 * Si coexisten RESEND_MOCK_MODE y RESEND_API_KEY (p. ej. .dev.vars residual),
 * prevalece el mock para evitar envíos reales durante pruebas locales.
 */
export function resolveResendMockMode(env: Env): string | undefined {
  const configured = env.RESEND_MOCK_MODE?.trim();
  if (!configured) {
    return undefined;
  }
  if (
    configured !== 'success' &&
    configured !== 'fail_empresa' &&
    configured !== 'fail_constancia' &&
    configured !== 'fail_both'
  ) {
    return undefined;
  }
  return configured;
}

/** Turnstile de prueba y Resend mock cuando RESEND_MOCK_MODE está activo. */
export function isLocalMockRuntime(env: Env): boolean {
  return resolveResendMockMode(env) !== undefined;
}

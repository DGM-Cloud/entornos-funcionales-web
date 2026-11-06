/**
 * Mock de Resend solo en entornos locales sin API key real.
 * - Si existe RESEND_API_KEY → nunca mock (Production/Preview con secretos).
 * - La cabecera del cliente NUNCA activa el mock.
 */
export function resolveResendMockMode(env: Env): string | undefined {
  const configured = env.RESEND_MOCK_MODE?.trim();
  if (!configured) {
    return undefined;
  }
  if (env.RESEND_API_KEY?.trim()) {
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

/** Turnstile de prueba solo cuando el mock local está activo. */
export function isLocalMockRuntime(env: Env): boolean {
  return resolveResendMockMode(env) !== undefined;
}

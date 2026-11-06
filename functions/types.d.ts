interface Env {
  DB: D1Database;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  ALLOWED_ORIGIN?: string;
  /**
   * Solo para pruebas locales. Valores:
   * success | fail_empresa | fail_constancia | fail_both
   * Nunca configurar en Production.
   */
  RESEND_MOCK_MODE?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  waitUntil: (promise: Promise<unknown>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  params: Record<string, string | string[]>;
  data: Record<string, unknown>;
}

type PagesFunction<E = Env> = (
  context: Omit<PagesContext, 'env'> & { env: E },
) => Response | Promise<Response>;

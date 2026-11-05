export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: 'missing_token' | 'invalid_token' | 'upstream_error' };

/**
 * Verifica un token Turnstile con la API Siteverify.
 * No registra el token ni el secreto.
 * En B2 los handlers no invocan esta función en producción.
 */
export async function verifyTurnstileToken(options: {
  secret: string;
  token: string;
  remoteip?: string;
}): Promise<TurnstileResult> {
  const token = options.token.trim();
  if (!token) {
    return { ok: false, reason: 'missing_token' };
  }

  try {
    const body = new URLSearchParams();
    body.set('secret', options.secret);
    body.set('response', token);
    if (options.remoteip) {
      body.set('remoteip', options.remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!response.ok) {
      return { ok: false, reason: 'upstream_error' };
    }

    const data = (await response.json()) as { success?: boolean };
    if (data.success === true) {
      return { ok: true };
    }
    return { ok: false, reason: 'invalid_token' };
  } catch {
    return { ok: false, reason: 'upstream_error' };
  }
}

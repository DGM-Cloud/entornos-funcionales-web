import { MAIL } from './env';

export interface ResendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string | string[];
}

export type ResendResult =
  | { ok: true; id?: string }
  | { ok: false; reason: 'missing_api_key' | 'upstream_error' | 'rejected' };

/**
 * Cliente mínimo de Resend.
 * From siempre es el remitente corporativo fijo.
 * mockMode solo debe resolverse vía resolveResendMockMode (sin API key real).
 */
export async function sendResendEmail(
  apiKey: string | undefined,
  input: ResendEmailInput,
  options?: { mockMode?: string; mockChannel?: 'empresa' | 'constancia' },
): Promise<ResendResult> {
  const mock = options?.mockMode?.trim();
  // Si el caller pasó un mockMode reconocido (vía RESEND_MOCK_MODE), no llamar a Resend.
  // Production no debe definir RESEND_MOCK_MODE.
  if (mock === 'fail_both') {
    return { ok: false, reason: 'rejected' };
  }
  if (mock === 'fail_empresa' && options?.mockChannel === 'empresa') {
    return { ok: false, reason: 'rejected' };
  }
  if (mock === 'fail_constancia' && options?.mockChannel === 'constancia') {
    return { ok: false, reason: 'rejected' };
  }
  if (mock === 'success' || mock === 'fail_empresa' || mock === 'fail_constancia') {
    return { ok: true, id: `mock_${options?.mockChannel ?? 'mail'}_${Date.now()}` };
  }

  if (!apiKey || apiKey.trim().length === 0) {
    return { ok: false, reason: 'missing_api_key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL.from,
        to: input.to,
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      return { ok: false, reason: 'rejected' };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch {
    return { ok: false, reason: 'upstream_error' };
  }
}

export function buildContactoSubject(nombre: string): string {
  return `Nueva consulta web - ${nombre}`;
}

export function buildReclamacionSubject(codigo: string): string {
  return `Nueva reclamación - ${codigo}`;
}

export function buildConstanciaSubject(codigo: string): string {
  return `Constancia de reclamación - ${codigo}`;
}

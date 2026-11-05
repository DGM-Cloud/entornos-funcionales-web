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
 * En B2 los handlers preparatorios NO invocan esta función.
 */
export async function sendResendEmail(
  apiKey: string | undefined,
  input: ResendEmailInput,
): Promise<ResendResult> {
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

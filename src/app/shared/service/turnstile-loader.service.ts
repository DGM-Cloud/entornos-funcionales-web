import { Injectable } from '@angular/core';

const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_SCRIPT_ATTR = 'data-turnstile-api';

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

/**
 * Carga el API de Cloudflare Turnstile solo cuando una ruta de formulario lo solicita.
 * Reutiliza una única promesa / script para navegación interna y reentradas.
 */
@Injectable({ providedIn: 'root' })
export class TurnstileLoaderService {
  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Turnstile no disponible fuera del navegador.'));
    }

    if (window.turnstile) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[${TURNSTILE_SCRIPT_ATTR}]`,
      );

      if (existing) {
        if (window.turnstile) {
          resolve();
          return;
        }
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener(
          'error',
          () => {
            this.loadPromise = null;
            reject(new Error('No se pudo cargar Cloudflare Turnstile.'));
          },
          { once: true },
        );
        return;
      }

      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.setAttribute(TURNSTILE_SCRIPT_ATTR, 'true');
      script.onload = () => resolve();
      script.onerror = () => {
        this.loadPromise = null;
        reject(new Error('No se pudo cargar Cloudflare Turnstile.'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}

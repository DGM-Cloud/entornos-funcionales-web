import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

export type AnalyticsConsent = 'accepted' | 'rejected';

const STORAGE_KEY = 'ef_analytics_consent';
const LEGACY_KEY = 'cookiesAccepted';
const SCRIPT_ID = 'cf-web-analytics-beacon';

/**
 * Preferencias de analítica (Cloudflare Web Analytics).
 * Turnstile no depende de este consentimiento.
 *
 * Nota operativa: la inyección automática del dashboard de Cloudflare Pages
 * debe desactivarse manualmente; de lo contrario el banner no puede impedir
 * la carga previa del beacon.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsConsentService {
  readonly consent = signal<AnalyticsConsent | null>(null);
  readonly bannerVisible = signal(false);

  init(): void {
    this.migrateLegacyPreference();
    const stored = this.readStored();
    this.consent.set(stored);
    this.bannerVisible.set(stored === null);

    if (stored === 'accepted') {
      this.loadAnalytics();
    }
  }

  accept(): void {
    this.persist('accepted');
    this.consent.set('accepted');
    this.bannerVisible.set(false);
    this.loadAnalytics();
  }

  reject(): void {
    const hadAccepted = this.consent() === 'accepted';
    this.persist('rejected');
    this.consent.set('rejected');
    this.bannerVisible.set(false);
    this.unloadAnalytics();
    // Un script ya inicializado puede haber registrado listeners; la recarga
    // garantiza que no continúe la medición tras un rechazo posterior.
    if (hadAccepted && typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  /** Permite reabrir el banner desde privacidad / preferencias. */
  openPreferences(): void {
    this.bannerVisible.set(true);
  }

  private migrateLegacyPreference(): void {
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy !== null) {
        // Conservador: no interpretar aceptación antigua como consentimiento
        // válido para la nueva analítica controlada.
        localStorage.removeItem(LEGACY_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }

  private readStored(): AnalyticsConsent | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === 'accepted' || value === 'rejected') {
        return value;
      }
      if (value !== null) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    return null;
  }

  private persist(value: AnalyticsConsent): void {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  }

  private loadAnalytics(): void {
    if (typeof document === 'undefined') {
      return;
    }
    const token = environment.cloudflareWebAnalyticsToken?.trim();
    if (!token || token === 'REPLACE_WITH_CF_WEB_ANALYTICS_TOKEN') {
      return;
    }
    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: true }));
    document.head.appendChild(script);
  }

  private unloadAnalytics(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.getElementById(SCRIPT_ID)?.remove();
  }
}

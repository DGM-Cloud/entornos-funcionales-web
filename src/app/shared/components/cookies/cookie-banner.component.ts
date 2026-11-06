import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsConsentService } from '../../service/analytics-consent.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (analytics.bannerVisible()) {
      <div
        class="fixed bottom-0 left-0 w-full bg-[#0B121D]/95 backdrop-blur-md border-t border-slate-800 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] animate-fade-in-up"
        role="dialog"
        aria-label="Preferencias de analítica">
        <div class="max-w-7xl mx-auto px-5 md:px-6 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex-1 text-center md:text-left">
            <p class="font-inter text-xs md:text-[13px] text-[#B8C3D2] font-light leading-relaxed">
              Utilizamos almacenamiento local para recordar su preferencia y, solo si usted lo acepta,
              Cloudflare Web Analytics para medir el uso del sitio de forma agregada.
              Cloudflare Turnstile protege los formularios y no depende de esta elección.
              Puede cambiar su decisión cuando lo desee. Más información en nuestra
              <a routerLink="/privacidad" class="text-[#5C968D] hover:text-[#F5F6F8] font-medium underline underline-offset-2 transition-colors">Política de Privacidad</a>.
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <button type="button"
                    (click)="analytics.reject()"
                    class="border border-slate-600 hover:border-slate-400 text-[#B8C3D2] hover:text-white font-inter text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors">
              Rechazar
            </button>
            <button type="button"
                    (click)="analytics.accept()"
                    class="bg-[#1E3E62] hover:bg-[#335092] text-white font-inter text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-sm transition-colors">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeInUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class CookieBannerComponent {
  readonly analytics = inject(AnalyticsConsentService);
}

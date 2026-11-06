import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';
import { FloatingWhatsapp } from './shared/components/floating-whatsapp/floating-whatsapp';
import { CookieBannerComponent } from './shared/components/cookies/cookie-banner.component';
import { AnalyticsConsentService } from './shared/service/analytics-consent.service';
import { SeoService } from './shared/seo/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, FloatingWhatsapp, CookieBannerComponent],
  template: `
    <app-header />

    <main class="min-h-screen pt-[72px]" id="contenido-principal">
      <router-outlet />
    </main>

    <app-footer />
    <app-floating-whatsapp />
    <app-cookie-banner></app-cookie-banner>
  `
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly analyticsConsent = inject(AnalyticsConsentService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.analyticsConsent.init();
    this.seo.applyForUrl(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => this.seo.applyForUrl(event.urlAfterRedirects));
  }
}

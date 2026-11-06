import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DEFAULT_SEO, PAGE_SEO, SITE_ORIGIN, type PageSeo } from './page-seo';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  applyForUrl(url: string): void {
    const path = this.normalizePath(url);
    const seo = PAGE_SEO[path] ?? {
      ...DEFAULT_SEO,
      title: this.title.getTitle() || DEFAULT_SEO.title,
      path,
    };
    this.apply(seo);
  }

  apply(seo: PageSeo): void {
    const canonical = `${SITE_ORIGIN}${seo.path === '/' ? '/' : seo.path}`;
    const indexContent = seo.index === false ? 'noindex,follow' : 'index,follow';

    this.title.setTitle(seo.title);

    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: indexContent });
    this.setCanonical(canonical);

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_PE' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Entornos Funcionales' });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({
      property: 'og:image',
      content: `${SITE_ORIGIN}/assets/logo.webp`,
    });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: seo.title });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
  }

  private setCanonical(url: string): void {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private normalizePath(url: string): string {
    const path = url.split('?')[0].split('#')[0];
    if (!path || path === '/') {
      return '/';
    }
    return path.endsWith('/') ? path.slice(0, -1) : path;
  }
}

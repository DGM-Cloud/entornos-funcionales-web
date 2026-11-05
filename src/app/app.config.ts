import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // 1. Esto asegura que al cambiar de ruta, SIEMPRE se vaya a la parte superior (top)
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      // 2. Esto añade un efecto de "fade" (fundido cruzado) natural al cambiar de página,
      // eliminando el "corte" fuerte de Angular.
      withViewTransitions()
    )
  ]
};

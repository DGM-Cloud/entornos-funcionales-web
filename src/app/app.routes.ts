import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Entornos Funcionales | Reconstrucción & Acabados Arquitectónicos',
    loadComponent: () => import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'nosotros',
    title: 'Nosotros | Capacidad Técnica y Solvencia en Obra',
    loadComponent: () => import('./features/about/about').then(m => m.About)
  },
  {
    path: 'servicios',
    title: 'Servicios | Especialidades en Acabados y Reconstrucción',
    loadComponent: () => import('./features/services/services').then(m => m.Services)
  },
  {
    path: 'proyectos',
    title: 'Proyectos | Portafolio de Obras Ejecutadas',
    loadComponent: () => import('./features/projects/projects').then(m => m.Projects)
  },
  {
    path: 'contacto',
    title: 'Contacto | Validación Técnica y Solicitud de Propuestas',
    loadComponent: () => import('./features/contact/contact').then(m => m.Contact)
  },
  {
    path: 'privacidad',
    title: 'Políticas de Privacidad | Entornos Funcionales',
    loadComponent: () => import('./shared/components/footer/privacidad.component').then(m => m.PrivacidadComponent)
  },
  {
    path: 'terminos',
    title: 'Términos y Condiciones | Entornos Funcionales',
    loadComponent: () => import('./shared/components/footer/terminos.component').then(m => m.TerminosComponent)
  },
  {
    path: 'libro-reclamaciones',
    title: 'Libro de Reclamaciones | Entornos Funcionales',
    loadComponent: () => import('./shared/components/libro-reclamaciones/libro-reclamaciones.component').then(m => m.LibroReclamacionesComponent)
  },
  // Rutas desconocidas → inicio (CSR). No inventar páginas 404 indexables.
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

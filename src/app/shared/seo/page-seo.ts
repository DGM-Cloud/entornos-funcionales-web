export interface PageSeo {
  title: string;
  description: string;
  path: string;
  /** Si es false, no sugerimos indexación (p. ej. Libro de Reclamaciones). */
  index?: boolean;
}

export const SITE_ORIGIN = 'https://entornosfuncionales.com';

export const DEFAULT_SEO: PageSeo = {
  title: 'Entornos Funcionales | Reconstrucción y Acabados Arquitectónicos',
  description:
    'Entornos Funcionales S.A.C. ejecuta partidas arquitectónicas e instalaciones técnicas de alta complejidad para el sector corporativo e industrial en Lima, Perú.',
  path: '/',
  index: true,
};

/** Metadatos por ruta (CSR: se aplican tras cargar Angular). */
export const PAGE_SEO: Record<string, PageSeo> = {
  '/': DEFAULT_SEO,
  '/nosotros': {
    title: 'Nosotros | Capacidad Técnica y Solvencia en Obra',
    description:
      'Conozca la capacidad técnica, solvencia operativa y enfoque de ejecución de Entornos Funcionales S.A.C. en proyectos de reconstrucción y acabados.',
    path: '/nosotros',
  },
  '/servicios': {
    title: 'Servicios | Especialidades en Acabados y Reconstrucción',
    description:
      'Servicios de electricidad industrial, redes hidrosanitarias, acabados, pintura y especialidades técnicas para obra corporativa e industrial.',
    path: '/servicios',
  },
  '/proyectos': {
    title: 'Proyectos | Portafolio de Obras Ejecutadas',
    description:
      'Portafolio técnico de obras y acabados ejecutados por Entornos Funcionales S.A.C. para el sector corporativo e industrial.',
    path: '/proyectos',
  },
  '/contacto': {
    title: 'Contacto | Validación Técnica y Solicitud de Propuestas',
    description:
      'Solicite validación técnica o cotización. Envíe los detalles de su proyecto al equipo de Entornos Funcionales S.A.C.',
    path: '/contacto',
  },
  '/privacidad': {
    title: 'Políticas de Privacidad | Entornos Funcionales',
    description:
      'Política de privacidad y tratamiento de datos personales de Entornos Funcionales S.A.C., conforme a la normativa peruana aplicable.',
    path: '/privacidad',
  },
  '/terminos': {
    title: 'Términos y Condiciones | Entornos Funcionales',
    description:
      'Términos y condiciones de uso del sitio web institucional de Entornos Funcionales S.A.C.',
    path: '/terminos',
  },
  '/libro-reclamaciones': {
    title: 'Libro de Reclamaciones | Entornos Funcionales',
    description:
      'Libro de reclamaciones virtual de Entornos Funcionales S.A.C. para registrar reclamos o quejas conforme a la normativa de protección al consumidor.',
    path: '/libro-reclamaciones',
    index: false,
  },
};

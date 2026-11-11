import { Injectable } from '@angular/core';
import { Proyecto } from '../interfaces/proyecto.interface';

const imagenesProyecto = (numero: number, cantidad: number) => {
  const carpeta = String(numero).padStart(2, '0');

  return Array.from(
    { length: cantidad },
    (_, indice) => `assets/projects/project-${carpeta}/${String(indice + 1).padStart(2, '0')}.jpg`,
  );
};

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly projects: Proyecto[] = [
    {
      id: 'proyecto-01',
      codigo: 'EF-01',
      categoria: 'cubiertas',
      titulo: 'Proyecto 01 · Cubiertas',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Remodelación y renovación de techos en la Parroquia Santo Toribio: retiro de madera deteriorada, instalación de una nueva estructura de madera y placas OSB de 18 mm, impermeabilización con alquitrán y tela, y colocación de planchas Onduline.',
      imagen: imagenesProyecto(1, 12)[0],
      imagenAntes: imagenesProyecto(1, 12)[0] || imagenesProyecto(1, 12)[0], // Imagen de respaldo para el Antes
      imagenDespues: imagenesProyecto(1, 12)[3], // Imagen para el Después
      galeria: imagenesProyecto(1, 12),
      partidas: ['Cubiertas', 'Trabajo en alturas'],
    },
    {
      id: 'proyecto-02',
      codigo: 'EF-02',
      categoria: 'remodelacion',
      titulo: 'Proyecto 02 · Remodelación interior',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Trabajos de pintura y acabados en la Parroquia Santo Toribio: retiro de pintura antigua, preparación y tratamiento de superficies, aplicación de pintura en paredes y elementos de madera, y renovación de acabados interiores y exteriores.',
      imagen: imagenesProyecto(2, 9)[0],
      imagenAntes: imagenesProyecto(2, 9)[6] || imagenesProyecto(2, 9)[0],
      imagenDespues: imagenesProyecto(2, 9)[3],
      galeria: imagenesProyecto(2, 9),
      partidas: ['Remodelación', 'Acabados interiores'],
    },
    {
      id: 'proyecto-03',
      codigo: 'EF-03',
      categoria: 'construccion',
      titulo: 'Proyecto 03 · Implementación técnica',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Implementación y acondicionamiento de oficinas para El Gallo Más Gallo en Lima Central Tower: instalación de tabiquería de drywall, divisiones y cerramientos interiores, tratamiento de juntas, falso cielo raso modular, pintura y acabados finales.',
      imagen: imagenesProyecto(3, 8)[0],
      imagenAntes: imagenesProyecto(3, 8)[4] || imagenesProyecto(3, 8)[0],
      imagenDespues: imagenesProyecto(3, 8)[7],
      galeria: imagenesProyecto(3, 8),
      partidas: ['Construcción', 'Instalaciones técnicas'],
    },
    {
      id: 'proyecto-04',
      codigo: 'EF-04',
      categoria: 'construccion',
      titulo: 'Proyecto 04 · Estructura metálica',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Implementación y acondicionamiento de un centro médico de fertilidad en San Isidro: instalación de drywall y falso cielo raso modular, tratamiento de juntas, pintura, zócalos, instalaciones eléctricas, iluminación LED y acabados finales.',
      imagen: imagenesProyecto(4, 15)[0],
      imagenAntes: '',
      imagenDespues:
        'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793318606/Entrada_moderna_con_p%C3%A9rgola_y_flores.png',
      galeria: imagenesProyecto(4, 15),
      partidas: ['Estructura metálica', 'Construcción liviana'],
    },
    {
      id: 'proyecto-05',
      codigo: 'EF-05',
      categoria: 'interiores',
      titulo: 'Proyecto 05 · Iluminación interior',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Acondicionamiento de local comercial para WIN en el Centro de Lima: instalación de drywall en paredes y cielo raso, tratamiento de juntas, masillado, lijado y preparación de superficies, además de aplicación de pintura y esmalte.',
      imagen: imagenesProyecto(5, 6)[0],
      imagenAntes: imagenesProyecto(5, 6)[5] || imagenesProyecto(5, 6)[0],
      imagenDespues: imagenesProyecto(5, 6)[1],
      galeria: imagenesProyecto(5, 6),
      partidas: ['Iluminación', 'Acabados interiores'],
    },
    {
      id: 'proyecto-06',
      codigo: 'EF-06',
      categoria: 'interiores',
      titulo: 'Proyecto 06 · Adecuación de oficina',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Repintado y mantenimiento de oficinas de Lindcorp en La Molina: protección de mobiliario y pisos, resane y lijado de paredes, preparación de superficies, aplicación de pintura en los ambientes interiores y retoques finales.',
      imagen: imagenesProyecto(6, 2)[0],
      imagenAntes: imagenesProyecto(6, 2)[1] || imagenesProyecto(6, 2)[0],
      imagenDespues: imagenesProyecto(6, 2)[0],
      galeria: imagenesProyecto(6, 2),
      partidas: ['Adecuación de oficinas', 'Interiores'],
    },
    {
      id: 'proyecto-07',
      codigo: 'EF-07',
      categoria: 'climatizacion',
      titulo: 'Proyecto 07 · Climatización',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Remodelación de oficinas en el edificio Central Tower, incluyendo adecuación de ambientes, instalación de equipos de climatización, redes técnicas visibles y terminaciones interiores.',
      imagen: imagenesProyecto(7, 14)[0],
      imagenAntes: imagenesProyecto(7, 14)[6] || imagenesProyecto(7, 14)[0],
      imagenDespues: imagenesProyecto(7, 14)[4],
      galeria: imagenesProyecto(7, 14),
      partidas: ['Climatización', 'Instalaciones HVAC'],
    },
    {
      id: 'proyecto-08',
      codigo: 'EF-08',
      categoria: 'cubiertas',
      titulo: 'Proyecto 08 · Impermeabilización',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Rehabilitación e impermeabilización de techos en Chicha, Santa Anita y La Molina: instalación de tejas y mantos asfálticos, impermeabilización de termotechos, sellado de juntas y acondicionamiento de coberturas.',
      imagen: imagenesProyecto(8, 4)[0],
      imagenAntes: imagenesProyecto(8, 4)[0] || imagenesProyecto(8, 4)[0],
      imagenDespues: imagenesProyecto(8, 4)[3],
      galeria: imagenesProyecto(8, 4),
      partidas: ['Impermeabilización', 'Cubiertas'],
    },
    {
      id: 'proyecto-09',
      codigo: 'EF-09',
      categoria: 'interiores',
      titulo: 'Proyecto 09 · Mobiliario integrado',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Remodelación y acondicionamiento de departamento en el Callao: fabricación e instalación de cajoneras, módulos, repisas y muebles de almacenamiento en melamina, iluminación LED integrada y acabados finales.',
      imagen: imagenesProyecto(9, 6)[0],
      imagenAntes: imagenesProyecto(9, 6)[0] || imagenesProyecto(9, 6)[0],
      imagenDespues: imagenesProyecto(9, 6)[4],
      galeria: imagenesProyecto(9, 6),
      partidas: ['Mobiliario integrado', 'Carpintería'],
    },
    {
      id: 'proyecto-10',
      codigo: 'EF-10',
      categoria: 'interiores',
      titulo: 'Proyecto 10 · Mobiliario de cocina',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Remodelación y acondicionamiento de departamento en el Callao: fabricación e instalación de muebles altos y bajos de cocina en melamina, puerta de aluminio, iluminación LED integrada, acabados y ajustes finales.',
      imagen: imagenesProyecto(10, 4)[0],
      imagenAntes: imagenesProyecto(10, 4)[1] || imagenesProyecto(10, 4)[0],
      imagenDespues: imagenesProyecto(10, 4)[0],
      galeria: imagenesProyecto(10, 4),
      partidas: ['Mobiliario de cocina', 'Interiores'],
    },
    {
      id: 'proyecto-11',
      codigo: 'EF-11',
      categoria: 'construccion',
      titulo: 'Proyecto 11 · Cubierta metálica',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Instalación de cobertura de policarbonato en San Isidro: fabricación y montaje de la estructura metálica de soporte, habilitación de perfiles, instalación, alineamiento y fijación de la cobertura, y acabados finales.',
      imagen: imagenesProyecto(11, 3)[0],
      imagenAntes: imagenesProyecto(11, 3)[1] || imagenesProyecto(11, 3)[0],
      imagenDespues: imagenesProyecto(11, 3)[2],
      galeria: imagenesProyecto(11, 3),
      partidas: ['Cubierta metálica', 'Construcción'],
    },
    {
      id: 'proyecto-12',
      codigo: 'EF-12',
      categoria: 'climatizacion',
      titulo: 'Proyecto 12 · Mantenimiento HVAC',
      cliente: 'Por confirmar',
      ubicacion: 'Por confirmar',
      metraje: 'Por confirmar',
      plazo: 'Por confirmar',
      descripcion:
        'Mantenimiento preventivo y diagnóstico de equipos HVAC, con revisión de la unidad condensadora, medición de parámetros eléctricos e inspección de conexiones y del circuito de refrigeración.',
      imagen: imagenesProyecto(12, 2)[0],
      imagenAntes: imagenesProyecto(12, 2)[0] || imagenesProyecto(12, 2)[0],
      imagenDespues: imagenesProyecto(12, 2)[1],
      galeria: imagenesProyecto(12, 2),
      partidas: ['Mantenimiento HVAC', 'Climatización'],
    },
  ];

  getProjects(): Proyecto[] {
    return this.projects;
  }
}

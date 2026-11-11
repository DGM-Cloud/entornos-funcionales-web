export type CategoriaProyecto =
  | 'todos'
  | 'cubiertas'
  | 'remodelacion'
  | 'construccion'
  | 'interiores'
  | 'climatizacion'
  | 'corporativo'
  | 'comercial'
  | 'industrial'
  | 'residencial';

export interface Proyecto {
  id: string;
  codigo: string;
  categoria: Exclude<CategoriaProyecto, 'todos'>;
  titulo: string;
  cliente: string;
  ubicacion: string;
  metraje: string;
  plazo: string;
  descripcion: string;
  imagen: string;
  imagenAntes?: string;
  imagenDespues?: string;
  galeria?: string[];
  partidas: string[];
}

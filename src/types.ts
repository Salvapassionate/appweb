export interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

export interface Business {
    id: string;
    logoUrl: string;
    logo?: string;
    nombreComercial: string;
    sector: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    razonSocial: string;
    quienesSomos: string;
    horario: Horario[];
    inicio: string;
    fin: string;
    dia: string;
    telefono: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    sitioWeb: string;
    direccion: string;
    direccionGeorreferenciada: string;
    estado: boolean;
  }

  export interface Category {
    id: string;
    iconoUrl:string;
    nombre: string;
    descripcion: string;
    estado: boolean;
    logo?: string;
  }

  export interface Product{
    id: string;
   logoUrl:string;
   logo?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string ;
  empresa: string ;
  estado: boolean;
  }
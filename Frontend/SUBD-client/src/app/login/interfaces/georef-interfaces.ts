export interface IProvincia {
  id: string;
  nombre: string;
}

export interface IMunicipio {
  id: string;
  nombre: string;
}

export interface ILocalidad {
  id: string;
  nombre: string;
}

export interface IProvinciasResponse {
  provincias: IProvincia[];
}

export interface IMunicipiosResponse {
  municipios: IMunicipio[];
}

export interface ILocalidadesResponse {
  localidades: ILocalidad[];
}

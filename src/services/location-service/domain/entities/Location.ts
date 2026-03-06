export class Location {
  constructor(
    public readonly id: number,
    public readonly reporte_id: number,
    public readonly latitud: number,
    public readonly longitud: number,
    public readonly precision_metros: number,
    public readonly fecha_subido: Date
  ) {}
}

export class Direccion {
  constructor(
    public readonly id: number,
    public readonly reporte_id: number,
    public readonly pais: string | null,
    public readonly estado: string | null,
    public readonly ciudad: string | null,
    public readonly municipio: string | null,
    public readonly colonia: string | null,
    public readonly barrio: string | null,
    public readonly display_name: string | null,
    public readonly fecha_subido: Date
  ) {}
}
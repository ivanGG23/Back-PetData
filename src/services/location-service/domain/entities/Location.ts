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
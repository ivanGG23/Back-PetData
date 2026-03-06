import { Location, Direccion } from "../entities/Location";
import { CreateLocationRequest } from "../dto/CreateLocationRequest";

export interface ILocationRepository {
  save(data: CreateLocationRequest): Promise<Location>;
  findByReporteId(reporte_id: number): Promise<Location | null>;
  saveDireccion(reporte_id: number, latitud: number, longitud: number): Promise<Direccion>;
}
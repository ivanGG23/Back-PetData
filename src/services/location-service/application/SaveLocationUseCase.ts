import { ILocationRepository } from "../domain/utils/ILocationRepository";
import { CreateLocationRequest } from "../domain/dto/CreateLocationRequest";
import { Location } from "../domain/entities/Location";

export class SaveLocationUseCase {
  constructor(private readonly repository: ILocationRepository) {}

  async execute(data: CreateLocationRequest): Promise<Location> {
    if (!data.reporte_id || !data.latitud || !data.longitud) {
      throw new Error("Campos requeridos: reporte_id, latitud, longitud");
    }

    if (data.latitud < -90 || data.latitud > 90) {
      throw new Error("Latitud inválida. Debe estar entre -90 y 90");
    }

    if (data.longitud < -180 || data.longitud > 180) {
      throw new Error("Longitud inválida. Debe estar entre -180 y 180");
    }

    return await this.repository.save(data);
  }
}
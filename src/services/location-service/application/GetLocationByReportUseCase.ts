import { ILocationRepository } from "../domain/utils/ILocationRepository";
import { Location } from "../domain/entities/Location";

export class GetLocationByReportUseCase {
  constructor(private readonly repository: ILocationRepository) {}

  async execute(reporte_id: number): Promise<Location> {
    if (!reporte_id || reporte_id <= 0) {
      throw new Error("reporte_id inválido");
    }

    const location = await this.repository.findByReporteId(reporte_id);

    if (!location) {
      throw new Error(`No se encontró ubicación para el reporte con id ${reporte_id}`);
    }

    return location;
  }
}
import { PrismaClient } from "@prisma/client";
import { ILocationRepository } from "../../domain/utils/ILocationRepository";
import { CreateLocationRequest } from "../../domain/dto/CreateLocationRequest";
import { Location } from "../../domain/entities/Location";

export class PostgreSQLLocationRepository implements ILocationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(data: CreateLocationRequest): Promise<Location> {
    const record = await this.prisma.locacion.create({
      data: {
        reporte_id: data.reporte_id,
        latitud: data.latitud,
        longitud: data.longitud,
        precision_metros: data.precision_metros,
      },
    });

    return new Location(
      record.id,
      record.reporte_id,
      Number(record.latitud),
      Number(record.longitud),
      Number(record.precision_metros),
      record.fecha_subido
    );
  }

  async findByReporteId(reporte_id: number): Promise<Location | null> {
    const record = await this.prisma.locacion.findUnique({
      where: { reporte_id },
    });

    if (!record) return null;

    return new Location(
      record.id,
      record.reporte_id,
      Number(record.latitud),
      Number(record.longitud),
      Number(record.precision_metros),
      record.fecha_subido
    );
  }
}
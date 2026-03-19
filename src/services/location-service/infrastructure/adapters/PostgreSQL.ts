import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { ILocationRepository } from "../../domain/utils/ILocationRepository";
import { CreateLocationRequest } from "../../domain/dto/CreateLocationRequest";
import { Location, Direccion } from "../../domain/entities/Location";

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

  async saveDireccion(reporte_id: number, latitud: number, longitud: number): Promise<Direccion> {
    // Llamada a Nominatim
    let pais: string | null = null;
    let estado: string | null = null;
    let ciudad: string | null = null;
    let municipio: string | null = null;
    let colonia: string | null = null;
    let barrio: string | null = null;
    let display_name: string | null = null;

    try {
      const { data } = await axios.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          lat: latitud,
          lon: longitud,
          format: "json",
        },
        headers: {
          "User-Agent": "PetData-App/1.0 (contacto@petdata.com)",
        },
      });

      const address = data.address ?? {};
      pais         = address.country        ?? null;
      estado       = address.state          ?? null;
      ciudad       = address.city           ?? address.town ?? address.village ?? null;
      municipio    = address.county         ?? address.municipality ?? null;
      colonia      = address.suburb         ?? address.neighbourhood ?? null;
      barrio       = address.quarter        ?? null;
      display_name = data.display_name      ?? null;

    } catch (error) {
      // Si Nominatim falla, guardamos igual pero sin datos de dirección
      console.error("Nominatim error:", error);
    }

    const record = await this.prisma.direccion.create({
      data: {
        reporte_id,
        pais,
        estado,
        ciudad,
        municipio,
        colonia,
        barrio,
        display_name,
      },
    });

    return new Direccion(
      record.id,
      record.reporte_id,
      record.pais,
      record.estado,
      record.ciudad,
      record.municipio,
      record.colonia,
      record.barrio,
      record.display_name,
      record.fecha_subido
    );
  }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetHeatmapUseCase {
    async execute(estado_reporte_id?: number) {

        const reportes = await prisma.rEPORTS.findMany({
            where: {
                ...(estado_reporte_id ? { estado_reporte_actual: estado_reporte_id } : {}),
                locacion: { isNot: null },   // ← reemplaza locacion_id: { not: null }
            },
            select: {
                id: true,
                estado_reporte_actual: true,
                prioridad_id: true,
                locacion: true,              // ← reemplaza locacion_id
            },
        });

        return reportes
            .filter(r => r.locacion !== null)
            .map(r => ({
                reporte_id:            r.id,
                latitud:               parseFloat(r.locacion!.latitud.toString()),
                longitud:              parseFloat(r.locacion!.longitud.toString()),
                prioridad_id:          r.prioridad_id,
                estado_reporte_actual: r.estado_reporte_actual,
            }));
    }
}
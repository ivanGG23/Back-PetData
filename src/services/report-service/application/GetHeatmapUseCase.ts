import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetHeatmapUseCase {
    async execute() {
        try {
            // Uso de transacción para garantizar consistencia y seguridad
            const puntos = await prisma.$transaction(async (tx) => {
                return await tx.$queryRawUnsafe<any[]>(
                    `SELECT latitud, longitud, prioridad_nivel, reporte_id
                     FROM v_heatmap`
                );
            });

            if (puntos.length === 0) {
                console.warn('[GetHeatmap] No se encontraron puntos en la vista v_heatmap');
                return [];
            }

            // Log de auditoría
            console.info(`[GetHeatmap] Se obtuvieron ${puntos.length} puntos para el mapa de calor`);

            return puntos.map(p => ({
                lat: Number(p.latitud),
                lng: Number(p.longitud),
                prioridad_nivel: Number(p.prioridad_nivel),
                reporte_id: Number(p.reporte_id),
            }));
        } catch (error) {
            // Manejo explícito de errores
            console.error('[GetHeatmap] Error al consultar v_heatmap:', error);
            throw new Error('Error interno al generar el mapa de calor');
        }
    }
}

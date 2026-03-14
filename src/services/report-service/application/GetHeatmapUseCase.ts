import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class GetHeatmapUseCase {
    async execute(estado_reporte_id?: number) {

        const reportes = await prisma.rEPORTS.findMany({
            where: {
                ...(estado_reporte_id ? { estado_reporte_actual: estado_reporte_id } : {}),
                locacion_id: { not: null },
            },
            select: {
                id: true,
                estado_reporte_actual: true,
                prioridad_id: true,
                locacion_id: true,
            },
        });

        const puntos = await Promise.all(
            reportes.map(async (reporte) => {
                try {
                    const response = await axios.get(
                        `${process.env.LOCATION_SERVICE_URL}/location/${reporte.id}`
                    );
                    // La respuesta tiene un nivel extra: response.data.data
                    const loc = response.data.data ?? response.data;
                    return {
                        reporte_id: reporte.id,
                        latitud: parseFloat(loc.latitud),
                        longitud: parseFloat(loc.longitud),
                        prioridad_id: reporte.prioridad_id,
                        estado_reporte_actual: reporte.estado_reporte_actual,
                    };
                } catch {
                    return null;
                }
            })
        );

        return puntos.filter((p) => p !== null);
    }
}
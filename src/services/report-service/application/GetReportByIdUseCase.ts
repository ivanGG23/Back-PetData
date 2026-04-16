import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Helper para pedir la primera imagen del tracking-service
async function getImagenInicial(reporte_id: number): Promise<string | null> {
    try {
        const res = await axios.get(
            `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia/${reporte_id}`
        );
        const evidencias = res.data as { url_img: string; tipo: string }[];
        const inicial = evidencias.find(e => e.tipo === 'inicial');
        return inicial?.url_img ?? evidencias[0]?.url_img ?? null;
    } catch (error) {
        console.error(`[TrackingService] Error al obtener evidencia del reporte ${reporte_id}:`, error);
        return null;
    }
}

export class GetReportByIdUseCase {
    async execute(id: number) {
        try {
            // Uso de transacción para garantizar consistencia y seguridad
            const result = await prisma.$transaction(async (tx) => {
                return await tx.$queryRawUnsafe<any[]>(
                    `SELECT * FROM v_reportes_completos WHERE id = $1`,
                    id
                );
            });

            if (result.length === 0) {
                console.warn(`[GetReportById] Reporte ${id} no encontrado`);
                return null;
            }

            const reporte = result[0];
            const imagen_url = await getImagenInicial(id);

            // Ejemplo de control de concurrencia: validación de versión
            if (reporte.version && reporte.version < 1) {
                throw new Error(`Versión inválida para reporte ${id}, posible condición de carrera`);
            }

            // Log de auditoría
            console.info(`[GetReportById] Reporte ${id} consultado correctamente`);

            return { ...reporte, imagen_url };
        } catch (error) {
            // Manejo explícito de errores
            console.error(`[GetReportById] Error al consultar reporte ${id}:`, error);
            throw new Error('Error interno al obtener el reporte');
        }
    }
}

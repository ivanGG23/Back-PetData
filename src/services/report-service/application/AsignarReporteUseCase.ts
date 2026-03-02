import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const MAX_CASOS_ACTIVOS = 2;

export class AsignarReporteUseCase {
    async execute(report_id: number, rescatista_id: number, rol_id: number) {

        if (rol_id !== 2) {
            throw new Error('Solo los rescatistas pueden asignarse a un reporte');
        }

        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: report_id },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        if (reporte.estado_reporte_actual !== 1) {
            throw new Error('Solo se puede asignar a reportes en estado Pendiente');
        }

        if (reporte.rescatista_id !== null) {
            throw new Error('Este reporte ya tiene un rescatista asignado');
        }

        // Verificar que el rescatista no tenga ya 2 casos activos
        const casosActivos = await prisma.rEPORTS.count({
            where: {
                rescatista_id,
                estado_reporte_actual: { in: [2, 3] },
            },
        });

        if (casosActivos >= MAX_CASOS_ACTIVOS) {
            throw new Error(`No puedes tomar más casos, ya tienes ${MAX_CASOS_ACTIVOS} casos activos`);
        }

        // Asignar rescatista y cambiar estado a En revisión
        const reporteActualizado = await prisma.rEPORTS.update({
            where: { id: report_id },
            data: {
                rescatista_id,
                estado_reporte_actual: 2,
                fecha_asig: new Date(),
            },
        });

        // Registrar en historial
        try {
            await axios.post(
                `${process.env.TRACKING_SERVICE_URL}/tracking/historial`,
                {
                    reporte_id: report_id,
                    estado_reporte_id: 2,
                    usuario_id: rescatista_id,
                    comentario: 'Rescatista asignado al caso',
                }
            );
        } catch (error) {
            console.error('Error al registrar historial de asignación:', error);
        }

        return {
            message: 'Asignado correctamente al reporte',
            reporte_id: reporteActualizado.id,
            rescatista_id,
            estado: 'En revisión',
        };
    }
}
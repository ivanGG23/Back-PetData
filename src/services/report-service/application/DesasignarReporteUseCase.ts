import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const MAX_DESASIGNACIONES_SEMANA = 3;

export class DesasignarReporteUseCase {
    async execute(report_id: number, rescatista_id: number, rol_id: number) {

        if (rol_id !== 2) {
            throw new Error('Solo los rescatistas pueden desasignarse de un reporte');
        }

        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: report_id },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        if (reporte.rescatista_id !== rescatista_id) {
            throw new Error('No estás asignado a este reporte');
        }

        if (reporte.estado_reporte_actual !== 2 && reporte.estado_reporte_actual !== 3) {
            throw new Error('Solo puedes desasignarte si el reporte está En revisión o En proceso');
        }

        // Regresar el reporte a Pendiente
        await prisma.rEPORTS.update({
            where: { id: report_id },
            data: {
                rescatista_id: null,
                estado_reporte_actual: 1,
                fecha_asig: null,
            },
        });

        // Registrar en historial
        try {
            await axios.post(
                `${process.env.TRACKING_SERVICE_URL}/tracking/historial`,
                {
                    reporte_id: report_id,
                    estado_reporte_id: 1,
                    usuario_id: rescatista_id,
                    comentario: 'Rescatista se desasignó del caso',
                }
            );
        } catch (error) {
            console.error('Error al registrar historial de desasignación:', error);
        }

        // Restar 5 puntos al rescatista
        try {
            await axios.post(
                `${process.env.REPUTATION_SERVICE_URL}/reputation`,
                {
                    usuario_id: rescatista_id,
                    reporte_id: report_id,
                    puntos: -5,
                    motivo: 'Rescatista se desasignó del caso',
                }
            );
        } catch (error) {
            console.error('Error al registrar reputación por desasignación:', error);
        }

        // Verificar desasignaciones en la última semana
        await this.verificarSuspension(rescatista_id, report_id);

        return {
            message: 'Te has desasignado del reporte correctamente',
            reporte_id: report_id,
        };
    }

    private async verificarSuspension(rescatista_id: number, reporte_id: number) {
        try {
            const haceUnaSemana = new Date();
            haceUnaSemana.setDate(haceUnaSemana.getDate() - 7);

            // Contar desasignaciones en la última semana buscando en el historial de reputación
            const desasignaciones = await prisma.rEPORTS.count({
                where: {
                    rescatista_id: null,
                    estado_reporte_actual: 1,
                    fecha_asig: null,
                },
            });

            // Mejor contamos por reputación negativa por desasignación
            const response = await axios.get(
                `${process.env.REPUTATION_SERVICE_URL}/reputation/${rescatista_id}`
            );

            const historial = response.data.historial;
            const haceUnaSemanaDate = new Date();
            haceUnaSemanaDate.setDate(haceUnaSemanaDate.getDate() - 7);

            const desasignacionesSemana = historial.filter((mov: any) =>
                mov.motivo === 'Rescatista se desasignó del caso' &&
                new Date(mov.fecha) >= haceUnaSemanaDate
            ).length;

            console.log(`Rescatista ${rescatista_id} tiene ${desasignacionesSemana} desasignaciones esta semana`);

            if (desasignacionesSemana >= MAX_DESASIGNACIONES_SEMANA) {
                await axios.put(
                    `${process.env.AUTH_SERVICE_URL}/auth/user/${rescatista_id}/suspender`
                );
                console.log(`Rescatista ${rescatista_id} suspendido por ${desasignacionesSemana} desasignaciones en la semana`);
            }
        } catch (error) {
            console.error('Error al verificar suspensión por desasignaciones:', error);
        }
    }
}
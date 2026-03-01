import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { ChangeStatusRequest } from '../domain/dto/ChangeStatusRequest';

const prisma = new PrismaClient();

const TRANSICIONES_RESCATISTA: Record<number, number[]> = {
    1: [2],
    2: [3],
    3: [4],
};

const ESTADO_FALSO = 5;
const ESTADO_RESUELTO = 4;

export class ChangeReportStatusUseCase {
    async execute(
        report_id: number,
        data: ChangeStatusRequest,
        usuario_id: number,
        rol_id: number
    ) {
        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: report_id },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        if (rol_id !== 2) {
            throw new Error('Solo los rescatistas pueden cambiar el estado de un reporte');
        }

        const estado_actual = reporte.estado_reporte_actual;
        const nuevo_estado = data.nuevo_estado_id;

        if (estado_actual === 4 || estado_actual === 5) {
            throw new Error('No se puede modificar un reporte que ya está cerrado');
        }

        // Validar que venga al menos una imagen si el estado es Resuelto
        if (nuevo_estado === ESTADO_RESUELTO) {
            if (!data.url_imgs || data.url_imgs.length === 0) {
                throw new Error('Se requiere al menos una imagen de cierre para marcar el reporte como resuelto');
            }
        }

        if (nuevo_estado === ESTADO_FALSO) {
            if (!data.comentario || data.comentario.trim() === '') {
                throw new Error('Se requiere una justificación para marcar el reporte como falso');
            }
        } else {
            const transicionesPermitidas = TRANSICIONES_RESCATISTA[estado_actual] || [];
            if (!transicionesPermitidas.includes(nuevo_estado)) {
                throw new Error(`No se puede cambiar de estado ${estado_actual} a estado ${nuevo_estado}`);
            }
        }

        const reporteActualizado = await prisma.rEPORTS.update({
            where: { id: report_id },
            data: {
                estado_reporte_actual: nuevo_estado,
                rescatista_id: usuario_id,
                fecha_asig: estado_actual === 1 ? new Date() : reporte.fecha_asig,
                fecha_cierre: nuevo_estado === ESTADO_RESUELTO || nuevo_estado === ESTADO_FALSO
                    ? new Date()
                    : null,
            },
        });

        // Registrar historial automáticamente
        await this.registrarHistorial(report_id, nuevo_estado, usuario_id, data.comentario, data.url_imgs);

        // Registrar reputación automáticamente
        await this.registrarReputacion(nuevo_estado, reporte.usuario_creador_id, usuario_id, report_id);

        return {
            message: 'Estado actualizado correctamente',
            reporte_id: reporteActualizado.id,
            estado_anterior: estado_actual,
            estado_nuevo: nuevo_estado,
            comentario: data.comentario ?? null,
        };
    }

    private async registrarHistorial(
        reporte_id: number,
        estado_reporte_id: number,
        usuario_id: number,
        comentario?: string,
        url_imgs?: string[]
    ) {
        try {
            await axios.post(
                `${process.env.TRACKING_SERVICE_URL}/tracking/historial`,
                {
                    reporte_id,
                    estado_reporte_id,
                    usuario_id,
                    comentario: comentario ?? undefined,
                }
            );

            // Si vienen imágenes de cierre las registramos todas
            if (url_imgs && url_imgs.length > 0 && estado_reporte_id === ESTADO_RESUELTO) {
                await Promise.all(
                    url_imgs.map((url_img) =>
                        axios.post(
                            `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia`,
                            {
                                reporte_id,
                                subido_por: usuario_id,
                                url_img,
                                tipo: 'cierre',
                            }
                        )
                    )
                );
            }
        } catch (error) {
            console.error('Error al registrar historial o evidencia:', error);
        }
    }

    private async registrarReputacion(
        nuevo_estado: number,
        ciudadano_id: number,
        rescatista_id: number,
        reporte_id: number
    ) {
        try {
            if (nuevo_estado === ESTADO_FALSO) {
                await axios.post(
                    `${process.env.REPUTATION_SERVICE_URL}/reputation`,
                    {
                        usuario_id: ciudadano_id,
                        reporte_id,
                        puntos: -5,
                        motivo: 'Reporte marcado como falso por rescatista',
                    }
                );
            } else if (nuevo_estado === ESTADO_RESUELTO) {
                await axios.post(
                    `${process.env.REPUTATION_SERVICE_URL}/reputation`,
                    {
                        usuario_id: ciudadano_id,
                        reporte_id,
                        puntos: 10,
                        motivo: 'Reporte confirmado como real y resuelto',
                    }
                );

                await axios.post(
                    `${process.env.REPUTATION_SERVICE_URL}/reputation`,
                    {
                        usuario_id: rescatista_id,
                        reporte_id,
                        puntos: 15,
                        motivo: 'Caso resuelto exitosamente',
                    }
                );
            }
        } catch (error) {
            console.error('Error al registrar reputación:', error);
        }
    }
}
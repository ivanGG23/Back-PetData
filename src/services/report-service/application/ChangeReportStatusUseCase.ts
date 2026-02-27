import { PrismaClient } from '@prisma/client';
import { ChangeStatusRequest } from '../domain/dto/ChangeStatusRequest';

const prisma = new PrismaClient();

// Transiciones permitidas por rol
const TRANSICIONES_RESCATISTA: Record<number, number[]> = {
    1: [2],       // Pendiente → En revisión
    2: [3],       // En revisión → En proceso
    3: [4],       // En proceso → Resuelto
};

const ESTADO_FALSO = 5;

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

        const estado_actual = reporte.estado_reporte_actual;
        const nuevo_estado = data.nuevo_estado_id;

        // Solo rescatistas pueden cambiar estado (rol_id 2)
        if (rol_id !== 2) {
            throw new Error('Solo los rescatistas pueden cambiar el estado de un reporte');
        }

        // Validar si quiere marcar como falso
        if (nuevo_estado === ESTADO_FALSO) {
            if (!data.comentario || data.comentario.trim() === '') {
                throw new Error('Se requiere una justificación para marcar el reporte como falso');
            }
        } else {
            // Validar transición permitida
            const transicionesPermitidas = TRANSICIONES_RESCATISTA[estado_actual] || [];
            if (!transicionesPermitidas.includes(nuevo_estado)) {
                throw new Error(
                    `No se puede cambiar de estado ${estado_actual} a estado ${nuevo_estado}`
                );
            }
        }

        // Actualizar el estado
        const reporteActualizado = await prisma.rEPORTS.update({
            where: { id: report_id },
            data: {
                estado_reporte_actual: nuevo_estado,
                rescatista_id: usuario_id,
                fecha_asig: estado_actual === 1 ? new Date() : reporte.fecha_asig,
                fecha_cierre: nuevo_estado === 4 || nuevo_estado === 5 ? new Date() : null,
            },
        });

        return {
            message: 'Estado actualizado correctamente',
            reporte_id: reporteActualizado.id,
            estado_anterior: estado_actual,
            estado_nuevo: nuevo_estado,
            comentario: data.comentario ?? null,
        };
    }
}
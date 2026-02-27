import { PrismaClient } from '@prisma/client';
import { UpdateReportRequest } from '../domain/dto/UpdateReportRequest';

const prisma = new PrismaClient();

export class UpdateReportUseCase {
    async execute(report_id: number, usuario_id: number, data: UpdateReportRequest) {
        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: report_id },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        // Solo el creador puede editar
        if (reporte.usuario_creador_id !== usuario_id) {
            throw new Error('No tienes permiso para editar este reporte');
        }

        // Solo se puede editar si está en estado Pendiente
        if (reporte.estado_reporte_actual !== 1) {
            throw new Error('Solo se pueden editar reportes en estado Pendiente');
        }

        // Validar estado_animal si viene
        if (data.estado_animal_id) {
            const estadoAnimal = await prisma.eSTADO_ANIMAL.findUnique({
                where: { id: data.estado_animal_id },
            });
            if (!estadoAnimal) {
                throw new Error('Estado del animal no válido');
            }
        }

        // Validar prioridad si viene
        if (data.prioridad_id) {
            const prioridad = await prisma.pRIORIDAD.findUnique({
                where: { id: data.prioridad_id },
            });
            if (!prioridad) {
                throw new Error('Prioridad no válida');
            }
        }

        const reporteActualizado = await prisma.rEPORTS.update({
            where: { id: report_id },
            data: {
                descripcion: data.descripcion,
                contacto_opcional: data.contacto_opcional,
                estado_animal_id: data.estado_animal_id,
                prioridad_id: data.prioridad_id,
            },
        });

        return {
            message: 'Reporte actualizado correctamente',
            reporte: reporteActualizado,
        };
    }
}
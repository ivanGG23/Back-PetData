import { PrismaClient } from '@prisma/client';
import { GetReportsRequest } from '../domain/dto/GetReportsRequest';

const prisma = new PrismaClient();

export class GetReportsUseCase {
    async execute(filtros: GetReportsRequest) {
        const where: any = {};

        if (filtros.estado_id) {
            where.estado_reporte_actual = Number(filtros.estado_id);
        }

        if (filtros.prioridad_id) {
            where.prioridad_id = Number(filtros.prioridad_id);
        }

        if (filtros.rescatista_id) {
            where.rescatista_id = Number(filtros.rescatista_id);
        }

        if (filtros.usuario_creador_id) {
            where.usuario_creador_id = Number(filtros.usuario_creador_id);
        }

        if (filtros.fecha_inicio || filtros.fecha_fin) {
            where.fecha_creacion = {};
            if (filtros.fecha_inicio) {
                where.fecha_creacion.gte = new Date(filtros.fecha_inicio);
            }
            if (filtros.fecha_fin) {
                where.fecha_creacion.lte = new Date(filtros.fecha_fin);
            }
        }

        const reportes = await prisma.rEPORTS.findMany({
            where,
            include: {
                estado_animal: true,
                estado_reporte: true,
                prioridad: true,
            },
            orderBy: {
                fecha_creacion: 'desc',
            },
        });

        return reportes;
    }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetUserStatsUseCase {
    async execute(usuario_id: number) {
        const [totalReportes, reportesFalsos] = await Promise.all([
            prisma.rEPORTS.count({
                where: { usuario_creador_id: usuario_id },
            }),
            prisma.rEPORTS.count({
                where: {
                    usuario_creador_id: usuario_id,
                    estado_reporte_actual: 5,
                },
            }),
        ]);

        return {
            usuario_id,
            total_reportes: totalReportes,
            reportes_falsos: reportesFalsos,
        };
    }
}
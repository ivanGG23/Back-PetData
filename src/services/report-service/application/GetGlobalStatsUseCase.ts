import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetGlobalStatsUseCase {
    async execute() {
        const [activos, rescatados, pendientes] = await Promise.all([
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 3 } }),
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 4 } }),
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 1 } }),
        ]);

        return { activos, rescatados, pendientes };
    }
}
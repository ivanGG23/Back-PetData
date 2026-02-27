import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetReportByIdUseCase {
    async execute(report_id: number) {
        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: report_id },
            include: {
                estado_animal: true,
                estado_reporte: true,
                prioridad: true,
            },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        return reporte;
    }
}
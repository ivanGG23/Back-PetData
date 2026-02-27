import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetReputacionUseCase {
    async execute(usuario_id: number) {
        const movimientos = await prisma.rEPUTACION_MOVIMIENTO.findMany({
            where: { usuario_id },
            orderBy: { fecha: 'desc' },
        });

        const total = await prisma.rEPUTACION_MOVIMIENTO.aggregate({
            where: { usuario_id },
            _sum: { puntos: true },
        });

        return {
            usuario_id,
            total_puntos: total._sum.puntos ?? 0,
            historial: movimientos,
        };
    }
}
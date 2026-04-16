import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetUserStatsUseCase {
    async execute(usuario_id: number) {
        try {
            // Uso de transacción para garantizar consistencia
            const result = await prisma.$transaction(async (tx) => {
                return await tx.$queryRawUnsafe<any[]>(
                    `SELECT * FROM v_stats_usuario WHERE usuario_creador_id = $1`,
                    usuario_id
                );
            });

            if (result.length === 0) {
                console.warn(`[GetUserStats] Usuario ${usuario_id} no tiene estadísticas registradas`);
                return {
                    usuario_creador_id: usuario_id,
                    total:       0,
                    resueltos:   0,
                    falsos:      0,
                    pendientes:  0,
                    en_proceso:  0,
                    en_revision: 0,
                };
            }

            const s = result[0];

            // Log de auditoría
            console.info(`[GetUserStats] Estadísticas obtenidas para usuario ${usuario_id}`);

            return {
                usuario_creador_id: Number(s.usuario_creador_id),
                total:       Number(s.total),
                resueltos:   Number(s.resueltos),
                falsos:      Number(s.falsos),
                pendientes:  Number(s.pendientes),
                en_proceso:  Number(s.en_proceso),
                en_revision: Number(s.en_revision),
            };
        } catch (error) {
            // Manejo explícito de errores
            console.error(`[GetUserStats] Error al consultar estadísticas del usuario ${usuario_id}:`, error);
            throw new Error('Error interno al obtener estadísticas del usuario');
        }
    }
}

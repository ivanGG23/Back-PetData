import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetGlobalStatsUseCase {
    async execute() {
        try {
            const result = await prisma.$transaction(async (tx) => {
                return await tx.$queryRawUnsafe<any[]>(
                    `SELECT
                        SUM(total)       AS total,
                        SUM(resueltos)   AS resueltos,
                        SUM(falsos)      AS falsos,
                        SUM(pendientes)  AS pendientes,
                        SUM(en_proceso)  AS en_proceso,
                        SUM(en_revision) AS en_revision,
                        COUNT(*)         AS total_usuarios_activos
                     FROM v_stats_usuario`
                );
            });

            if (result.length === 0) {
                console.warn('[GetGlobalStats] No se encontraron estadísticas globales en v_stats_usuario');
                return {
                    total: 0,
                    resueltos: 0,
                    falsos: 0,
                    pendientes: 0,
                    en_proceso: 0,
                    en_revision: 0,
                    total_usuarios_activos: 0,
                };
            }

            const s = result[0];

            // Log de auditoría
            console.info('[GetGlobalStats] Estadísticas globales obtenidas correctamente');

            return {
                total: Number(s.total ?? 0),
                resueltos: Number(s.resueltos ?? 0),
                falsos: Number(s.falsos ?? 0),
                pendientes: Number(s.pendientes ?? 0),
                en_proceso: Number(s.en_proceso ?? 0),
                en_revision: Number(s.en_revision ?? 0),
                total_usuarios_activos: Number(s.total_usuarios_activos ?? 0),
            };
        } catch (error) {
            // Manejo explícito de errores
            console.error('[GetGlobalStats] Error al consultar estadísticas globales:', error);
            throw new Error('Error interno al obtener estadísticas globales');
        }
    }
}

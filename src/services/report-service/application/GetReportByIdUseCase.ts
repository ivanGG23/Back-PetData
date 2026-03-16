import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Helper para pedir datos de un usuario al auth-service
async function getUserById(userId: number) {
    try {
        const res = await axios.get(
            `${process.env.AUTH_SERVICE_URL}/auth/users/${userId}`
        );
        return res.data as { user_id: number; nombre: string; apellido: string };
    } catch {
        return null;
    }
}

export class GetReportByIdUseCase {
    async execute(report_id: number) {
        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: report_id },
            include: {
                estado_animal: true,
                estado_reporte: true,
                prioridad: true,
                locacion: true,  
                direccion: true,
            },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        // Llamadas paralelas al auth-service para no hacer espera doble
        const [creador, rescatista] = await Promise.all([
            getUserById(reporte.usuario_creador_id),
            reporte.rescatista_id ? getUserById(reporte.rescatista_id) : Promise.resolve(null),
        ]);

        return {
            ...reporte,
            creador: creador
                ? { id: creador.user_id, nombre: `${creador.nombre} ${creador.apellido}` }
                : null,
            rescatista: rescatista
                ? { id: rescatista.user_id, nombre: `${rescatista.nombre} ${rescatista.apellido}` }
                : null,
        };
    }
}
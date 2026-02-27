import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CreateMovimientoRequest } from '../domain/dto/CreateMovimientoRequest';

const prisma = new PrismaClient();

export class CreateMovimientoUseCase {
    async execute(data: CreateMovimientoRequest) {
        // Registrar el movimiento
        const movimiento = await prisma.rEPUTACION_MOVIMIENTO.create({
            data: {
                usuario_id: data.usuario_id,
                reporte_id: data.reporte_id,
                puntos: data.puntos,
                motivo: data.motivo,
            },
        });

        // Calcular el total de puntos del usuario
        const total = await prisma.rEPUTACION_MOVIMIENTO.aggregate({
            where: { usuario_id: data.usuario_id },
            _sum: { puntos: true },
        });

        const totalPuntos = total._sum.puntos ?? 0;

        // Si el total baja de -10 notificar al auth-service para suspender la cuenta
        if (totalPuntos <= -10) {
            try {
                await axios.put(
                    `${process.env.AUTH_SERVICE_URL}/auth/user/${data.usuario_id}/suspender`,
                    { motivo: 'Puntaje de reputación bajo' }
                );
            } catch (error) {
                console.error('Error al notificar al auth-service:', error);
            }
        }

        return {
            movimiento,
            total_puntos: totalPuntos,
        };
    }
}
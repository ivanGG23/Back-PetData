import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CreateMovimientoRequest } from '../domain/dto/CreateMovimientoRequest';

const prisma = new PrismaClient();

const LIMITE_INFRACCIONES = 3;
const DIAS_VENTANA = 30;

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

        // Solo verificar suspensión si el movimiento es negativo
        if (data.puntos < 0) {
            await this.verificarSuspension(data.usuario_id);
        }

        // Calcular total histórico para devolver en la respuesta
        const total = await prisma.rEPUTACION_MOVIMIENTO.aggregate({
            where: { usuario_id: data.usuario_id },
            _sum: { puntos: true },
        });

        return {
            movimiento,
            total_puntos: total._sum.puntos ?? 0,
        };
    }

    private async verificarSuspension(usuario_id: number) {
        // Contar infracciones (movimientos negativos) en los últimos 30 días
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - DIAS_VENTANA);

        const infracciones = await prisma.rEPUTACION_MOVIMIENTO.count({
            where: {
                usuario_id,
                puntos: { lt: 0 },
                fecha: { gte: hace30Dias },
            },
        });

        console.log(`Verificando suspensión para usuario ${usuario_id}`);
        console.log(`Infracciones encontradas: ${infracciones}`);

        console.log(`Usuario ${usuario_id} tiene ${infracciones} infracciones en los últimos 30 días`);

        // Si llega al límite, suspender la cuenta
        if (infracciones >= LIMITE_INFRACCIONES) {
            try {
                await axios.put(
                    `${process.env.AUTH_SERVICE_URL}/auth/user/${usuario_id}/suspender`
                );
                console.log(`Usuario ${usuario_id} suspendido por ${infracciones} infracciones en 30 días`);
            } catch (error) {
                console.error('Error al suspender usuario:', error);
            }
        }
    }
}
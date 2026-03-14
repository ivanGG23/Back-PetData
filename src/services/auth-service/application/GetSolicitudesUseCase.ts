import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetSolicitudesUseCase {
    async execute() {
        return await prisma.uSER.findMany({
            where: { solicitud_rescatista: 'pendiente' },
            select: {
                user_id: true,
                nombre: true,
                apellido: true,
                correo: true,
                telefono: true,
                fecha_creacion: true,
                solicitud_rescatista: true
            }
        });
    }
}
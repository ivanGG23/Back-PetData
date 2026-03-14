import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetUsuariosUseCase {
    async execute() {
        return await prisma.uSER.findMany({
            select: {
                user_id: true,
                nombre: true,
                apellido: true,
                correo: true,
                rol_id: true,
                estado_cuenta: true,
                solicitud_rescatista: true,
                fecha_creacion: true
            },
            orderBy: { fecha_creacion: 'desc' }
        });
    }
}
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AprobarSolicitudUseCase {
    async execute(user_id: number) {
        const user = await prisma.uSER.findUnique({ where: { user_id } });
        if (!user) throw new Error('Usuario no encontrado');
        if (user.solicitud_rescatista !== 'pendiente') throw new Error('No hay solicitud pendiente');

        return await prisma.uSER.update({
            where: { user_id },
            data: { rol_id: 2, solicitud_rescatista: 'aprobada' }
        });
    }
}
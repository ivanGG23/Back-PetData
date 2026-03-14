import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SolicitarRescatistaUseCase {
    async execute(user_id: number) {
        const user = await prisma.uSER.findUnique({ where: { user_id } });

        if (!user) throw new Error('Usuario no encontrado');
        if (user.rol_id === 2) throw new Error('El usuario ya es rescatista');
        if (user.estado_cuenta === 'inactivo') throw new Error('Cuenta inactiva');
        if (user.solicitud_rescatista === 'pendiente') throw new Error('Ya tienes una solicitud pendiente');

        await prisma.uSER.update({
            where: { user_id },
            data: { solicitud_rescatista: 'pendiente' }
        });

        return { message: 'Solicitud enviada. Un administrador la revisará pronto.' };
    }
}
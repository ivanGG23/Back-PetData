import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DejarRescatistaUseCase {
    async execute(user_id: number) {
        const user = await prisma.uSER.findUnique({ where: { user_id } });

        if (!user) throw new Error('Usuario no encontrado');
        if (user.rol_id !== 2) throw new Error('El usuario no es rescatista');
        if (user.estado_cuenta === 'inactivo') throw new Error('Cuenta inactiva');

        await prisma.uSER.update({
            where: { user_id },
            data: { rol_id: 1 }
        });

        return { message: 'Has dejado de ser rescatista.' };
    }
}
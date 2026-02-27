import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SuspendUserUseCase {
    async execute(user_id: number) {
        const user = await prisma.uSER.findUnique({
            where: { user_id },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        await prisma.uSER.update({
            where: { user_id },
            data: {
                estado_cuenta: 'suspendido',
                fecha_ultima_restriccion: new Date(),
            },
        });

        return { message: 'Cuenta suspendida correctamente' };
    }
}
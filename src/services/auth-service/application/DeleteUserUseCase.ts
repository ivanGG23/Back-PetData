import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DeleteUserUseCase {
    async execute(user_id: number) {
        const user = await prisma.uSER.findUnique({
            where: { user_id },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.estado_cuenta === 'inactivo') {
            throw new Error('La cuenta ya está eliminada');
        }

        await prisma.uSER.update({
            where: { user_id },
            data: { estado_cuenta: 'inactivo' },
        });

        return { message: 'Cuenta eliminada correctamente' };
    }
}
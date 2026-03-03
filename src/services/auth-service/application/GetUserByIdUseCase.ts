import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetUserByIdUseCase {
    async execute(user_id: number) {
        const user = await prisma.uSER.findUnique({
            where: { user_id },
            select: {
                user_id: true,
                nombre: true,
                apellido: true,
                avatar_url: true,
            },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        return user;
    }
}
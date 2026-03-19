import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GetAllDireccionesUseCase {
    async execute() {
        return await prisma.direccion.findMany({
            select: {
                reporte_id: true,
                ciudad: true,
                municipio: true,
            },
        });
    }
}
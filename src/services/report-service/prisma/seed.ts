import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.eSTADO_ANIMAL.createMany({
        data: [
            { nombre: 'Herido', descripcion: 'Animal con heridas visibles que requiere atención veterinaria inmediata' },
            { nombre: 'Desnutrido', descripcion: 'Animal con signos evidentes de falta de alimentación prolongada' },
            { nombre: 'Abandonado', descripcion: 'Animal sin dueño aparente en la vía pública sin señales de maltrato físico' },
            { nombre: 'En peligro inmediato', descripcion: 'Animal en situación de riesgo de vida, requiere intervención urgente' },
        ],
        skipDuplicates: true,
    });

    await prisma.eSTADO_REPORTE.createMany({
        data: [
            { nombre: 'Pendiente', descripcion: 'Reporte recién creado, aún sin rescatista asignado' },
            { nombre: 'En revisión', descripcion: 'Un rescatista está evaluando el caso antes de desplazarse' },
            { nombre: 'En proceso', descripcion: 'El rescatista se ha desplazado y está atendiendo el caso' },
            { nombre: 'Resuelto', descripcion: 'El caso fue atendido exitosamente y se subió evidencia de cierre' },
            { nombre: 'Falso', descripcion: 'El reporte fue verificado como falso por un rescatista con justificación' },
        ],
        skipDuplicates: true,
    });

    await prisma.pRIORIDAD.createMany({
        data: [
            { nombre: 'Baja', nivel: 1 },
            { nombre: 'Media', nivel: 2 },
            { nombre: 'Alta', nivel: 3 },
            { nombre: 'Crítica', nivel: 4 },
        ],
        skipDuplicates: true,
    });

    console.log('Catálogos insertados correctamente');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
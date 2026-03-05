import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.eSTADO_ANIMAL.createMany({
        data: [
            { id: 1, nombre: 'Herido',               descripcion: 'Animal con heridas visibles que requiere atención veterinaria inmediata' },
            { id: 2, nombre: 'Desnutrido',            descripcion: 'Animal con signos evidentes de falta de alimentación prolongada' },
            { id: 3, nombre: 'Abandonado',            descripcion: 'Animal sin dueño aparente en la vía pública sin señales de maltrato físico' },
            { id: 4, nombre: 'En peligro inmediato',  descripcion: 'Animal en situación de riesgo de vida, requiere intervención urgente' },
        ],
        skipDuplicates: true,
    });

    await prisma.eSTADO_REPORTE.createMany({
        data: [
            { id: 1, nombre: 'Pendiente',   descripcion: 'Reporte recién creado, aún sin rescatista asignado' },
            { id: 2, nombre: 'En revisión', descripcion: 'Un rescatista está evaluando el caso antes de desplazarse' },
            { id: 3, nombre: 'En proceso',  descripcion: 'El rescatista se ha desplazado y está atendiendo el caso' },
            { id: 4, nombre: 'Resuelto',    descripcion: 'El caso fue atendido exitosamente y se subió evidencia de cierre' },
            { id: 5, nombre: 'Falso',       descripcion: 'El reporte fue verificado como falso por un rescatista con justificación' },
        ],
        skipDuplicates: true,
    });

    await prisma.pRIORIDAD.createMany({
        data: [
            { id: 1, nombre: 'Baja',    nivel: 1 },
            { id: 2, nombre: 'Media',   nivel: 2 },
            { id: 3, nombre: 'Alta',    nivel: 3 },
            { id: 4, nombre: 'Crítica', nivel: 4 },
        ],
        skipDuplicates: true,
    });

    await prisma.tIPO_ANIMAL.createMany({
        data: [
            { nombre: 'Perro', descripcion: 'Canino doméstico' },
            { nombre: 'Gato',  descripcion: 'Felino doméstico' },
            { nombre: 'Otro',  descripcion: 'Otro tipo de animal' },
        ],
        skipDuplicates: true,
    });

    console.log('Catálogos insertados correctamente');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
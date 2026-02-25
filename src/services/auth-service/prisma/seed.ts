import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.rOL.createMany({
        data: [
            { nombre: 'ciudadano', descripcion: 'Usuario general que puede crear reportes y dar seguimiento a sus casos' },
            { nombre: 'rescatista', descripcion: 'Usuario verificado que puede atender, filtrar y cerrar reportes de animales' },
            { nombre: 'administrador', descripcion: 'Usuario con acceso total al sistema, puede moderar y suspender cuentas' },
        ],
        skipDuplicates: true,
    })

    console.log('Roles insertados correctamente')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
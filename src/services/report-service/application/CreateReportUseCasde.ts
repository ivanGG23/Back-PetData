import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CreateReportRequest } from '../domain/dto/CreateReportRequest';

const prisma = new PrismaClient();

export class CreateReportUseCase {
    async execute(data: CreateReportRequest) {

        // Validar límite de 3 reportes por día
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const reportesHoy = await prisma.rEPORTS.count({
            where: {
                usuario_creador_id: data.usuario_creador_id,
                fecha_creacion: { gte: hoy },
            },
        });

        if (reportesHoy >= 3) {
            throw new Error('Has alcanzado el límite de 3 reportes por día');
        }

        // Validar que existan estado_animal y prioridad
        const estadoAnimal = await prisma.eSTADO_ANIMAL.findUnique({
            where: { id: data.estado_animal_id },
        });

        if (!estadoAnimal) {
            throw new Error('Estado del animal no válido');
        }

        const prioridad = await prisma.pRIORIDAD.findUnique({
            where: { id: data.prioridad_id },
        });

        if (!prioridad) {
            throw new Error('Prioridad no válida');
        }

        // Crear el reporte con estado "Pendiente" (id: 1)
        const reporte = await prisma.rEPORTS.create({
            data: {
                usuario_creador_id: data.usuario_creador_id,
                estado_animal_id: data.estado_animal_id,
                estado_reporte_actual: 1,
                prioridad_id: data.prioridad_id,
                descripcion: data.descripcion,
                contacto_opcional: data.contacto_opcional ?? null,
            },
        });

        // Llamar al location-service para guardar las coordenadas
        try {
            const locationResponse = await axios.post(
                `${process.env.LOCATION_SERVICE_URL}/location`,
                {
                    reporte_id: reporte.id,
                    latitud: data.latitud,
                    longitud: data.longitud,
                    precision_metros: data.precision_metros ?? null,
                }
            );

            // Actualizar el reporte con el locacion_id que devuelve el location-service
            await prisma.rEPORTS.update({
                where: { id: reporte.id },
                data: { locacion_id: locationResponse.data.id },
            });

        } catch (error) {
            // Si el location-service falla, eliminamos el reporte para mantener consistencia
            await prisma.rEPORTS.delete({ where: { id: reporte.id } });
            throw new Error('Error al guardar la ubicación, intenta de nuevo');
        }

        return {
            message: 'Reporte creado correctamente',
            reporte_id: reporte.id,
        };
    }
}
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { CreateReportRequest } from '../domain/dto/CreateReportRequest';
import { subirImagen } from '../infrastructure/utils/cloudinary';

const prisma = new PrismaClient();

export class CreateReportUseCase {
    async execute(data: CreateReportRequest, archivos: Express.Multer.File[]) {

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

        if (!archivos || archivos.length === 0) {
            throw new Error('Se requiere al menos una imagen para crear el reporte');
        }

        // Validar estado_animal y prioridad
        const estadoAnimal = await prisma.eSTADO_ANIMAL.findUnique({ where: { id: data.estado_animal_id } });
        if (!estadoAnimal) throw new Error('Estado del animal no válido');

        const prioridad = await prisma.pRIORIDAD.findUnique({ where: { id: data.prioridad_id } });
        if (!prioridad) throw new Error('Prioridad no válida');

        // Subir imágenes a Cloudinary antes de crear el reporte
        const urls = await Promise.all(
            archivos.map(archivo => subirImagen(archivo.buffer, `reporte_nuevo`))
        );

        const tipoAnimal = await prisma.tIPO_ANIMAL.findUnique({ where: { id: data.tipo_animal_id } });
        if (!tipoAnimal) throw new Error('Tipo de animal no válido');

        // Crear el reporte
        const reporte = await prisma.rEPORTS.create({
            data: {
                usuario_creador_id: data.usuario_creador_id,
                estado_animal_id: data.estado_animal_id,
                tipo_animal_id: data.tipo_animal_id,
                estado_reporte_actual: 1,
                prioridad_id: data.prioridad_id,
                descripcion: data.descripcion,
                contacto_opcional: data.contacto_opcional ?? null,
            },
        });

        // Guardar ubicación
        try {
            await axios.post(
                `${process.env.LOCATION_SERVICE_URL}/location`,
                {
                    reporte_id: reporte.id,
                    latitud: data.latitud,
                    longitud: data.longitud,
                    precision_metros: data.precision_metros ?? null,
                }
            );
            // ← se eliminó el prisma.rEPORTS.update con locacion_id
        } catch (error) {
            await prisma.rEPORTS.delete({ where: { id: reporte.id } });
            console.error('Error al guardar ubicación:', error?.response?.data || error?.message);
            console.error('URL usada:', process.env.LOCATION_SERVICE_URL);
            throw new Error('Error al guardar la ubicación, intenta de nuevo');
        }

        // Registrar evidencias iniciales
        try {
            await Promise.all(
                urls.map(url_img =>
                    axios.post(
                        `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia`,
                        {
                            reporte_id: reporte.id,
                            subido_por: data.usuario_creador_id,
                            url_img,
                            tipo: 'inicial',
                        }
                    )
                )
            );
        } catch (error) {
            console.error('Error al registrar evidencias iniciales:', error);
        }

        return {
            message: 'Reporte creado correctamente',
            reporte_id: reporte.id,
        };
    }
}
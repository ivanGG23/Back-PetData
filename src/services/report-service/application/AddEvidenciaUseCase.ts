import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { AddEvidenciaRequest } from '../domain/dto/AddEvidenciaRequest';

const prisma = new PrismaClient();

export class AddEvidenciaUseCase {
    async execute(data: AddEvidenciaRequest, usuario_id: number, rol_id: number) {

        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: data.reporte_id },
        });

        if (!reporte) {
            throw new Error('Reporte no encontrado');
        }

        // No se puede subir evidencia si el reporte está cerrado
        if (reporte.estado_reporte_actual === 4 || reporte.estado_reporte_actual === 5) {
            throw new Error('No se puede agregar evidencia a un reporte cerrado');
        }

        // Ciudadano solo puede subir en su propio reporte
        if (rol_id === 1 && reporte.usuario_creador_id !== usuario_id) {
            throw new Error('No tienes permiso para agregar evidencia a este reporte');
        }

        // Rescatista solo puede subir si está asignado al reporte
        if (rol_id === 2 && reporte.rescatista_id !== usuario_id) {
            throw new Error('Solo el rescatista asignado puede agregar evidencia');
        }

        if (!data.url_imgs || data.url_imgs.length === 0) {
            throw new Error('Se requiere al menos una imagen');
        }

        // Registrar evidencias de seguimiento
        try {
            await Promise.all(
                data.url_imgs.map((url_img) =>
                    axios.post(
                        `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia`,
                        {
                            reporte_id: data.reporte_id,
                            subido_por: usuario_id,
                            url_img,
                            tipo: 'seguimiento',
                        }
                    )
                )
            );
        } catch (error) {
            throw new Error('Error al guardar las imágenes, intenta de nuevo');
        }

        return {
            message: 'Evidencia de seguimiento agregada correctamente',
            reporte_id: data.reporte_id,
            imagenes_subidas: data.url_imgs.length,
        };
    }
}
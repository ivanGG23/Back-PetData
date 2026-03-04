import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { subirImagen } from '../infrastructure/utils/cloudinary';

const prisma = new PrismaClient();

export class AddEvidenciaUseCase {
    async execute(
        reporte_id: number,
        usuario_id: number,
        rol_id: number,
        archivos: Express.Multer.File[],
        tipo: string = 'seguimiento'
    ) {
        const reporte = await prisma.rEPORTS.findUnique({
            where: { id: reporte_id },
        });

        if (!reporte) throw new Error('Reporte no encontrado');

        if (reporte.estado_reporte_actual === 4 || reporte.estado_reporte_actual === 5) {
            throw new Error('No se puede agregar evidencia a un reporte cerrado');
        }

        if (rol_id === 1 && reporte.usuario_creador_id !== usuario_id) {
            throw new Error('No tienes permiso para agregar evidencia a este reporte');
        }

        if (rol_id === 2 && reporte.rescatista_id !== usuario_id) {
            throw new Error('Solo el rescatista asignado puede agregar evidencia');
        }

        if (!archivos || archivos.length === 0) {
            throw new Error('Se requiere al menos una imagen');
        }

        const urls = await Promise.all(
            archivos.map(archivo => subirImagen(archivo.buffer, `reporte_${reporte_id}`))
        );

        try {
            await Promise.all(
                urls.map(url_img =>
                    axios.post(
                        `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia`,
                        { reporte_id, subido_por: usuario_id, url_img, tipo }
                    )
                )
            );
        } catch {
            throw new Error('Error al guardar las imágenes, intenta de nuevo');
        }

        return {
            message: 'Evidencia agregada correctamente',
            reporte_id,
            imagenes_subidas: urls.length,
            urls,
        };
    }
}
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { GetReportsRequest } from '../domain/dto/GetReportsRequest';

const prisma = new PrismaClient();

async function getImagenInicial(reporte_id: number): Promise<string | null> {
    try {
        const res = await axios.get(
            `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia/${reporte_id}`
        );
        const evidencias = res.data as { url_img: string; tipo: string }[];
        const inicial = evidencias.find(e => e.tipo === 'inicial');
        return inicial?.url_img ?? evidencias[0]?.url_img ?? null;
    } catch {
        return null;
    }
}

export class GetReportsUseCase {
    async execute(filtros: GetReportsRequest) {
        const where: any = {};

        if (filtros.estado_id) where.estado_reporte_actual = Number(filtros.estado_id);
        if (filtros.prioridad_id) where.prioridad_id = Number(filtros.prioridad_id);
        if (filtros.rescatista_id) where.rescatista_id = Number(filtros.rescatista_id);
        if (filtros.usuario_creador_id) where.usuario_creador_id = Number(filtros.usuario_creador_id);
        if (filtros.tipo_animal_id) where.tipo_animal_id = Number(filtros.tipo_animal_id);

        if (filtros.fecha_inicio || filtros.fecha_fin) {
            where.fecha_creacion = {};
            if (filtros.fecha_inicio) where.fecha_creacion.gte = new Date(filtros.fecha_inicio);
            if (filtros.fecha_fin) where.fecha_creacion.lte = new Date(filtros.fecha_fin);
        }

        const reportes = await prisma.rEPORTS.findMany({
            where,
            include: {
                estado_animal: true,
                estado_reporte: true,
                prioridad: true,
                tipo_animal: true,
            },
            orderBy: { fecha_creacion: 'desc' },
        });

        // Obtener imagen inicial de cada reporte en paralelo
        const imagenes = await Promise.all(
            reportes.map((r: typeof reportes[0]) => getImagenInicial(r.id))
        );

        return reportes.map((r: typeof reportes[0], i: number) => ({
            ...r,
            imagen_url: imagenes[i],
        }));
    }
}
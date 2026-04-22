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

        // Construcción dinámica del WHERE igual que antes
        const conditions: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (filtros.estado_id) {
            conditions.push(`estado_reporte_actual = $${idx++}`);
            values.push(Number(filtros.estado_id));
        }
        if (filtros.prioridad_id) {
            conditions.push(`prioridad_id = $${idx++}`);
            values.push(Number(filtros.prioridad_id));
        }
        if (filtros.rescatista_id) {
            conditions.push(`rescatista_id = $${idx++}`);
            values.push(Number(filtros.rescatista_id));
        }
        if (filtros.usuario_creador_id) {
            conditions.push(`usuario_creador_id = $${idx++}`);
            values.push(Number(filtros.usuario_creador_id));
        }
        if (filtros.tipo_animal_id) {
            conditions.push(`tipo_animal_id = $${idx++}`);
            values.push(Number(filtros.tipo_animal_id));
        }
        if (filtros.fecha_inicio) {
            conditions.push(`fecha_creacion >= $${idx++}`);
            values.push(new Date(filtros.fecha_inicio));
        }
        if (filtros.fecha_fin) {
            conditions.push(`fecha_creacion <= $${idx++}`);
            values.push(new Date(filtros.fecha_fin));
        }

        const whereClause = conditions.length > 0
            ? `WHERE ${conditions.join(' AND ')}`
            : '';

        const reportes = await prisma.$queryRawUnsafe<any[]>(
            `SELECT * FROM v_reportes_lista ${whereClause} ORDER BY fecha_creacion DESC`,
            ...values
        );

        const imagenes = await Promise.all(
            reportes.map((r: any) => getImagenInicial(r.id))
        );

        return reportes.map((r: any, i: number) => ({
            ...r,
            imagen_url: imagenes[i],
        }));
    }
}
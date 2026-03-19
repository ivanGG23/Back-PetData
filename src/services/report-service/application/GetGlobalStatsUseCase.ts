import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class GetGlobalStatsUseCase {
    async execute() {
        const LOCATION_SERVICE_URL = process.env.LOCATION_SERVICE_URL;

        // ── Especies ──────────────────────────────────────────────
        const porEspecie = await prisma.rEPORTS.groupBy({
            by: ['tipo_animal_id'],
            _count: { tipo_animal_id: true },
        });

        const tiposAnimal = await prisma.tIPO_ANIMAL.findMany();

        const especies = porEspecie.map(e => ({
            tipo_animal_id: e.tipo_animal_id,
            nombre: tiposAnimal.find(t => t.id === e.tipo_animal_id)?.nombre ?? 'Desconocido',
            total: e._count.tipo_animal_id,
        }));

        // ── Contadores globales ───────────────────────────────────
        const [activos, rescatados, pendientes] = await Promise.all([
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 3 } }),
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 4 } }),
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 1 } }),
        ]);

        // ── Historial ─────────────────────────────────────────────
        const primerReporte = await prisma.rEPORTS.findFirst({
            orderBy: { fecha_creacion: 'asc' },
            select: { fecha_creacion: true },
        });

        // Si no hay reportes, historial vacío
        if (!primerReporte) {
            return { especies, historial: [], zonas: [], activos, rescatados, pendientes };
        }

        const ahora = new Date();
        const fechaInicio = primerReporte.fecha_creacion;

        const diasTotales = Math.ceil(
            (ahora.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)
        );

        const numIntervalos = Math.max(1, Math.ceil(diasTotales / 5));

        const reportesTodos = await prisma.rEPORTS.findMany({
            where: { fecha_creacion: { gte: fechaInicio } },
            select: { fecha_creacion: true, estado_reporte_actual: true, fecha_cierre: true },
        });

        const formatFecha = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;

        const intervalos = Array.from({ length: numIntervalos }, (_, i) => {
            const inicio = new Date(fechaInicio);
            inicio.setDate(fechaInicio.getDate() + i * 5);
            const fin = new Date(inicio);
            fin.setDate(inicio.getDate() + 5);
            const finReal = fin > ahora ? ahora : fin;
            return {
                label: `${formatFecha(inicio)}-${formatFecha(finReal)}`,
                inicio,
                fin: finReal,
            };
        });

        const historial = intervalos.map(({ label, inicio, fin }) => {
            const nuevos = reportesTodos.filter(
                r => r.fecha_creacion >= inicio && r.fecha_creacion < fin
            ).length;
            const resueltos = reportesTodos.filter(
                r => r.estado_reporte_actual === 4 &&
                    r.fecha_cierre &&
                    r.fecha_cierre >= inicio &&
                    r.fecha_cierre < fin
            ).length;
            return { periodo: label, nuevos, resueltos };
        }).filter(p => p.nuevos > 0 || p.resueltos > 0);

        // ── Zonas (via location-service) ──────────────────────────
        let zonas: any[] = [];
        try {
            const { data: direcciones } = await axios.get(
                `${LOCATION_SERVICE_URL}/location/direcciones`
            );

            const mapaZonas: Record<string, { total: number; resueltos: number }> = {};

            for (const dir of direcciones as { reporte_id: number; ciudad: string | null; municipio: string | null }[]) {
                const zona = dir.ciudad ?? dir.municipio ?? 'Sin zona';
                if (!mapaZonas[zona]) mapaZonas[zona] = { total: 0, resueltos: 0 };
                mapaZonas[zona].total++;
            }

            const resueltosTodos = await prisma.rEPORTS.findMany({
                where: { estado_reporte_actual: 4 },
                select: { id: true },
            });
            const idsResueltosSet = new Set(resueltosTodos.map(r => r.id));

            for (const dir of direcciones as { reporte_id: number; ciudad: string | null; municipio: string | null }[]) {
                const zona = dir.ciudad ?? dir.municipio ?? 'Sin zona';
                if (idsResueltosSet.has(dir.reporte_id)) {
                    mapaZonas[zona].resueltos++;
                }
            }

            zonas = Object.entries(mapaZonas)
                .map(([zona, datos]) => ({ zona, ...datos }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 10);

        } catch (error) {
            console.error('Error consultando location-service:', error);
            zonas = [];
        }

        return { especies, historial, zonas, activos, rescatados, pendientes };
    }
}
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

        // ── Historial (intervalos de 5 días, últimos 30 días) ─────
        const ahora = new Date();
        const hace30 = new Date(ahora);
        hace30.setDate(ahora.getDate() - 30);

        const reportes30 = await prisma.rEPORTS.findMany({
            where: { fecha_creacion: { gte: hace30 } },
            select: { fecha_creacion: true, estado_reporte_actual: true, fecha_cierre: true },
        });

        const intervalos = Array.from({ length: 6 }, (_, i) => {
            const inicio = new Date(hace30);
            inicio.setDate(hace30.getDate() + i * 5);
            const fin = new Date(inicio);
            fin.setDate(inicio.getDate() + 5);

            // ← reemplaza el label genérico por fechas reales
            const formatFecha = (d: Date) =>
                `${d.getDate()}/${d.getMonth() + 1}`;
            const label = `${formatFecha(inicio)}-${formatFecha(fin)}`;

            return { label, inicio, fin };
        });

        const historial = intervalos.map(({ label, inicio, fin }) => {
            const nuevos = reportes30.filter(
                r => r.fecha_creacion >= inicio && r.fecha_creacion < fin
            ).length;
            const resueltos = reportes30.filter(
                r => r.estado_reporte_actual === 4 &&
                    r.fecha_cierre &&
                    r.fecha_cierre >= inicio &&
                    r.fecha_cierre < fin
            ).length;
            return { periodo: label, nuevos, resueltos };
        });

        const [activos, rescatados, pendientes] = await Promise.all([
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 3 } }), // En proceso
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 4 } }), // Resuelto
            prisma.rEPORTS.count({ where: { estado_reporte_actual: 1 } }), // Pendiente
        ]);

        // ── Zonas (via location-service) ──────────────────────────
        let zonas: any[] = [];
        try {
            const { data: direcciones } = await axios.get(
                `${LOCATION_SERVICE_URL}/location/direcciones`
            );

            // Agrupar por barrio (o colonia si barrio es null)
            const mapaZonas: Record<string, { total: number; resueltos: number }> = {};

            for (const dir of direcciones as { reporte_id: number; barrio: string | null; colonia: string | null }[]) {
                const zona = dir.barrio ?? dir.colonia ?? 'Sin zona';
                if (!mapaZonas[zona]) mapaZonas[zona] = { total: 0, resueltos: 0 };
                mapaZonas[zona].total++;
            }

            // Obtener cuáles están resueltos
            const idsResueltos = new Set(
                reportes30
                    .filter(r => r.estado_reporte_actual === 4)
                    .map((_, i) => i) // placeholder, abajo lo hacemos bien
            );

            // Buscar resueltos reales
            const resueltosTodos = await prisma.rEPORTS.findMany({
                where: { estado_reporte_actual: 4 },
                select: { id: true },
            });
            const idsResueltosSet = new Set(resueltosTodos.map(r => r.id));

            for (const dir of direcciones as { reporte_id: number; barrio: string | null; colonia: string | null }[]) {
                const zona = dir.barrio ?? dir.colonia ?? 'Sin zona';
                if (idsResueltosSet.has(dir.reporte_id)) {
                    mapaZonas[zona].resueltos++;
                }
            }

            zonas = Object.entries(mapaZonas)
                .map(([zona, datos]) => ({ zona, ...datos }))
                .sort((a, b) => b.total - a.total)
                .slice(0, 10); // top 10 zonas

        } catch (error) {
            console.error('Error consultando location-service:', error);
            zonas = [];
        }

        return { especies, historial, zonas, activos, rescatados, pendientes };
    }
}
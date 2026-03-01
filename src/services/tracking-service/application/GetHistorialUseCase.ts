import { HistorialEstado } from '../infrastructure/models/HistorialEstado';

export class GetHistorialUseCase {
    async execute(reporte_id: number) {
        const historial = await HistorialEstado.find({ reporte_id })
            .sort({ fecha_cambio: 'asc' });

        return historial;
    }
}
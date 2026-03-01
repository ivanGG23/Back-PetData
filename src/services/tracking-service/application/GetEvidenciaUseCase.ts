import { Evidencia } from '../infrastructure/models/Evidencia';

export class GetEvidenciaUseCase {
    async execute(reporte_id: number) {
        const evidencia = await Evidencia.find({ reporte_id })
            .sort({ fecha_subido: 'asc' });

        return evidencia;
    }
}
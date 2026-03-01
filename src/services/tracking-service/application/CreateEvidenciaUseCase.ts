import { Evidencia } from '../infrastructure/models/Evidencia';
import { CreateEvidenciaRequest } from '../domain/dto/CreateEvidenciaRequest';

export class CreateEvidenciaUseCase {
    async execute(data: CreateEvidenciaRequest) {
        const evidencia = await Evidencia.create({
            reporte_id: data.reporte_id,
            subido_por: data.subido_por,
            url_img: data.url_img,
            tipo: data.tipo,
        });

        return evidencia;
    }
}
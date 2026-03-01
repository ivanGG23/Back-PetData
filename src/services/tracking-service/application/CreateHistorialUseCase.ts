import { HistorialEstado } from '../infrastructure/models/HistorialEstado';
import { CreateHistorialRequest } from '../domain/dto/CreateHistorialRequest';

export class CreateHistorialUseCase {
    async execute(data: CreateHistorialRequest) {
        const historial = await HistorialEstado.create({
            reporte_id: data.reporte_id,
            estado_reporte_id: data.estado_reporte_id,
            usuario_id: data.usuario_id,
            comentario: data.comentario ?? undefined,
        });

        return historial;
    }
}
import { Comentario } from '../infrastructure/models/Comentario';

export class GetComentariosUseCase {
    async execute(reporte_id: number) {
        const comentarios = await Comentario.find({ reporte_id })
            .sort({ fecha: 1 });
        return comentarios;
    }
}
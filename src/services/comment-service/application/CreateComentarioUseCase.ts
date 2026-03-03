import { Comentario } from '../infrastructure/models/Comentario';
import { CreateComentarioRequest } from '../domain/dto/CreateComentarioRequest';

export class CreateComentarioUseCase {
    async execute(data: CreateComentarioRequest, usuario_id: number) {
        if (!data.comentario || data.comentario.trim().length === 0) {
            throw new Error('El comentario no puede estar vacío');
        }

        if (data.comentario.length > 500) {
            throw new Error('El comentario no puede superar los 500 caracteres');
        }

        const comentario = await Comentario.create({
            reporte_id: data.reporte_id,
            usuario_id,
            comentario: data.comentario.trim(),
        });

        return comentario;
    }
}
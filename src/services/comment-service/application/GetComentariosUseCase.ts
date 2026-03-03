import axios from 'axios';
import { Comentario } from '../infrastructure/models/Comentario';

async function getUserById(userId: number) {
    try {
        const res = await axios.get(
            `${process.env.AUTH_SERVICE_URL}/auth/users/${userId}`
        );
        return res.data as { user_id: number; nombre: string; apellido: string };
    } catch {
        return null;
    }
}

export class GetComentariosUseCase {
    async execute(reporte_id: number) {
        const comentarios = await Comentario.find({ reporte_id }).sort({ fecha: 1 });

        // Obtenemos los IDs únicos para no llamar al auth-service más de una vez por usuario
        const idsUnicos = [...new Set(comentarios.map(c => c.usuario_id))];

        const usuarios = await Promise.all(idsUnicos.map(id => getUserById(id)));

        const mapaUsuarios = new Map(
            idsUnicos.map((id, i) => [id, usuarios[i]])
        );

        return comentarios.map(c => ({
            _id: c._id,
            reporte_id: c.reporte_id,
            usuario_id: c.usuario_id,
            nombre_usuario: mapaUsuarios.get(c.usuario_id)
                ? `${mapaUsuarios.get(c.usuario_id)!.nombre} ${mapaUsuarios.get(c.usuario_id)!.apellido}`
                : `Usuario #${c.usuario_id}`,
            comentario: c.comentario,
            fecha: c.fecha,
        }));
    }
}
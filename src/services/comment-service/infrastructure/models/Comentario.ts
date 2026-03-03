import mongoose, { Schema, Document } from 'mongoose';

export interface IComentario extends Document {
    reporte_id: number;
    usuario_id: number;
    comentario: string;
    fecha: Date;
}

const ComentarioSchema = new Schema({
    reporte_id: { type: Number, required: true },
    usuario_id: { type: Number, required: true },
    comentario: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
});

export const Comentario = mongoose.model<IComentario>('Comentario', ComentarioSchema);
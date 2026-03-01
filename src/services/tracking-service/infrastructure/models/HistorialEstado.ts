import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialEstado extends Document {
    reporte_id: number;
    estado_reporte_id: number;
    usuario_id: number;
    fecha_cambio: Date;
    comentario?: string;
}

const HistorialEstadoSchema = new Schema<IHistorialEstado>({
    reporte_id: { type: Number, required: true },
    estado_reporte_id: { type: Number, required: true },
    usuario_id: { type: Number, required: true },
    fecha_cambio: { type: Date, default: Date.now },
    comentario: { type: String, default: null },
});

export const HistorialEstado = mongoose.model<IHistorialEstado>(
    'HistorialEstado',
    HistorialEstadoSchema
);
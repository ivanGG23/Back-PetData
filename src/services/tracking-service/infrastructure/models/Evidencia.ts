import mongoose, { Schema, Document } from 'mongoose';

export interface IEvidencia extends Document {
    reporte_id: number;
    subido_por: number;
    url_img: string;
    tipo: 'inicial' | 'cierre' | 'seguimiento';
    fecha_subido: Date;
}

const EvidenciaSchema = new Schema<IEvidencia>({
    reporte_id: { type: Number, required: true },
    subido_por: { type: Number, required: true },
    url_img: { type: String, required: true },
    tipo: { type: String, enum: ['inicial', 'cierre', 'seguimiento'], required: true },
    fecha_subido: { type: Date, default: Date.now },
});

export const Evidencia = mongoose.model<IEvidencia>('Evidencia', EvidenciaSchema);
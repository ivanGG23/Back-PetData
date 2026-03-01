export interface CreateHistorialRequest {
    reporte_id: number;
    estado_reporte_id: number;
    usuario_id: number;
    comentario?: string;
}
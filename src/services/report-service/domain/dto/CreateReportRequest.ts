export interface CreateReportRequest {
    usuario_creador_id: number;
    estado_animal_id: number;
    prioridad_id: number;
    descripcion: string;
    contacto_opcional?: string;
    latitud: number;
    longitud: number;
    precision_metros?: number;
    url_imgs: string[];
}
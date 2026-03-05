export interface GetReportsRequest {
    estado_id?: number | string;
    prioridad_id?: number | string;
    tipo_animal_id?: number | string;
    rescatista_id?: number | string;
    usuario_creador_id?: number | string;
    fecha_inicio?: string;
    fecha_fin?: string;
}
export interface CreateReportRequest {
    //especie_id🙀: number; perro, gato, ave, otro
    usuario_creador_id: number;
    estado_animal_id: number;
    prioridad_id: number; // prioridad -> front
    descripcion: string; // descripcion adicional -> front
    contacto_opcional?: string;
    latitud: number; // ubicacion -> front
    longitud: number; // ubicacion -> front
    precision_metros?: number; 
    url_imgs: string[]; // fotografia
}
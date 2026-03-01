export interface ChangeStatusRequest {
    nuevo_estado_id: number;
    comentario?: string;
    url_imgs?: string[];
}
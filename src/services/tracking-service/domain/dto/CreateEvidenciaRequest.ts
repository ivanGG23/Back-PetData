export interface CreateEvidenciaRequest {
    reporte_id: number;
    subido_por: number;
    url_img: string;
    tipo: 'inicial' | 'cierre' | 'seguimiento';
}
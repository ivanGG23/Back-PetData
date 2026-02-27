import { Request, Response } from 'express';
import { GetReportsUseCase } from '../../application/GetReportsUseCase';

const getReportsUseCase = new GetReportsUseCase();

export const getReports = async (req: Request, res: Response) => {
    try {
        const filtros = {
            estado_id: req.query.estado_id as string,
            prioridad_id: req.query.prioridad_id as string,
            rescatista_id: req.query.rescatista_id as string,
            usuario_creador_id: req.query.usuario_creador_id as string,
            fecha_inicio: req.query.fecha_inicio as string,
            fecha_fin: req.query.fecha_fin as string,
        };

        const reportes = await getReportsUseCase.execute(filtros);
        res.status(200).json(reportes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
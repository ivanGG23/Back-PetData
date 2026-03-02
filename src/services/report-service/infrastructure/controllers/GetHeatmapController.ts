import { Request, Response } from 'express';
import { GetHeatmapUseCase } from '../../application/GetHeatmapUseCase';

const getHeatmapUseCase = new GetHeatmapUseCase();

export const getHeatmap = async (req: Request, res: Response) => {
    try {
        const estado_reporte_id = req.query['estado_reporte_id']
            ? parseInt(req.query['estado_reporte_id'] as string)
            : undefined;

        const result = await getHeatmapUseCase.execute(estado_reporte_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
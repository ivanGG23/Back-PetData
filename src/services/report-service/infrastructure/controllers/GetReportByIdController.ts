import { Request, Response } from 'express';
import { GetReportByIdUseCase } from '../../application/GetReportByIdUseCase';

const getReportByIdUseCase = new GetReportByIdUseCase();

export const getReportById = async (req: Request, res: Response) => {
    try {
        const report_id = parseInt(req.params['id'] as string);

        if (isNaN(report_id)) {
            res.status(400).json({ error: 'ID de reporte inválido' });
            return;
        }

        const reporte = await getReportByIdUseCase.execute(report_id);
        res.status(200).json(reporte);
    } catch (error: any) {
        if (error.message === 'Reporte no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
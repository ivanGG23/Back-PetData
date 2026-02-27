import { Request, Response } from 'express';
import { UpdateReportUseCase } from '../../application/UpdateReportUseCase';

const updateReportUseCase = new UpdateReportUseCase();

export const updateReport = async (req: Request, res: Response) => {
    try {
        const report_id = parseInt(req.params['id'] as string);
        const usuario_id = parseInt(req.headers['usuario_id'] as string);

        if (isNaN(report_id)) {
            res.status(400).json({ error: 'ID de reporte inválido' });
            return;
        }

        const result = await updateReportUseCase.execute(
            report_id,
            usuario_id,
            req.body
        );
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Reporte no encontrado') {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};
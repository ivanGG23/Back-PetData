import { Request, Response } from 'express';
import { ChangeReportStatusUseCase } from '../../application/ChangeReportStatusUseCase';

const changeReportStatusUseCase = new ChangeReportStatusUseCase();

export const changeReportStatus = async (req: Request, res: Response) => {
    try {
        const report_id = parseInt(req.params['id'] as string);
        const usuario_id = parseInt(req.headers['usuario_id'] as string);
        const rol_id = parseInt(req.headers['rol_id'] as string);

        if (isNaN(report_id)) {
            res.status(400).json({ error: 'ID de reporte inválido' });
            return;
        }

        const result = await changeReportStatusUseCase.execute(
            report_id,
            req.body,
            usuario_id,
            rol_id
        );
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Reporte no encontrado') {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso') || error.message.includes('rescatista')) {
            res.status(403).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};
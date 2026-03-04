import { Request, Response } from 'express';
import { AddEvidenciaUseCase } from '../../application/AddEvidenciaUseCase';

const addEvidenciaUseCase = new AddEvidenciaUseCase();

export const addEvidencia = async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.headers['usuario_id'] as string);
        const rol_id     = parseInt(req.headers['rol_id'] as string);
        const reporte_id = parseInt(req.body.reporte_id as string);
        const tipo       = req.body.tipo ?? 'seguimiento';
        const archivos   = req.files as Express.Multer.File[];

        if (isNaN(reporte_id)) {
            res.status(400).json({ error: 'reporte_id inválido' });
            return;
        }

        const result = await addEvidenciaUseCase.execute(
            reporte_id, usuario_id, rol_id, archivos, tipo
        );
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message === 'Reporte no encontrado') {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('permiso') || error.message.includes('asignado')) {
            res.status(403).json({ error: error.message });
        } else if (error.message.includes('cerrado')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
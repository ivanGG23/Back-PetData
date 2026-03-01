import { Request, Response } from 'express';
import { CreateEvidenciaUseCase } from '../../application/CreateEvidenciaUseCase';
import { GetEvidenciaUseCase } from '../../application/GetEvidenciaUseCase';

const createEvidenciaUseCase = new CreateEvidenciaUseCase();
const getEvidenciaUseCase = new GetEvidenciaUseCase();

export const createEvidencia = async (req: Request, res: Response) => {
    try {
        const result = await createEvidenciaUseCase.execute(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getEvidencia = async (req: Request, res: Response) => {
    try {
        const reporte_id = parseInt(req.params['reporte_id'] as string);

        if (isNaN(reporte_id)) {
            res.status(400).json({ error: 'ID de reporte inválido' });
            return;
        }

        const result = await getEvidenciaUseCase.execute(reporte_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
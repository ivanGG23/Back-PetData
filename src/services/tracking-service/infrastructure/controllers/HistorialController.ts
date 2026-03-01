import { Request, Response } from 'express';
import { CreateHistorialUseCase } from '../../application/CreateHistorialUseCase';
import { GetHistorialUseCase } from '../../application/GetHistorialUseCase';

const createHistorialUseCase = new CreateHistorialUseCase();
const getHistorialUseCase = new GetHistorialUseCase();

export const createHistorial = async (req: Request, res: Response) => {
    try {
        const result = await createHistorialUseCase.execute(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getHistorial = async (req: Request, res: Response) => {
    try {
        const reporte_id = parseInt(req.params['reporte_id'] as string);

        if (isNaN(reporte_id)) {
            res.status(400).json({ error: 'ID de reporte inválido' });
            return;
        }

        const result = await getHistorialUseCase.execute(reporte_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
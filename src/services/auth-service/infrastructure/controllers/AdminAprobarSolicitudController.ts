import { Request, Response } from 'express';
import { AprobarSolicitudUseCase } from '../../application/AprobarSolicitudUseCase';

const useCase = new AprobarSolicitudUseCase();

export const aprobarSolicitud = async (req: Request, res: Response) => {
    try {
        const user_id = parseInt(req.params['id'] as string);
        if (isNaN(user_id)) { res.status(400).json({ error: 'ID inválido' }); return; }
        const result = await useCase.execute(user_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
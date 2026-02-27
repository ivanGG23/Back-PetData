import { Request, Response } from 'express';
import { GetReputacionUseCase } from '../../application/GetReputacionUseCase';

const getReputacionUseCase = new GetReputacionUseCase();

export const getReputacion = async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params['usuario_id'] as string);

        if (isNaN(usuario_id)) {
            res.status(400).json({ error: 'ID de usuario inválido' });
            return;
        }

        const result = await getReputacionUseCase.execute(usuario_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
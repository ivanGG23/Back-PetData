import { Request, Response } from 'express';
import { GetUserStatsUseCase } from '../../application/GetUserStatsUseCase';

const getUserStatsUseCase = new GetUserStatsUseCase();

export const getUserStats = async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params['usuario_id'] as string);

        if (isNaN(usuario_id)) {
            res.status(400).json({ error: 'ID de usuario inválido' });
            return;
        }

        const result = await getUserStatsUseCase.execute(usuario_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
import { Request, Response } from 'express';
import { DejarRescatistaUseCase } from '../../application/DejarRescatistaUseCase';

const dejarRescatistaUseCase = new DejarRescatistaUseCase();

export const dejarRescatista = async (req: Request, res: Response) => {
    try {
        const user_id = parseInt(req.params['id'] as string);

        if (isNaN(user_id)) {
            res.status(400).json({ error: 'ID de usuario inválido' });
            return;
        }

        const result = await dejarRescatistaUseCase.execute(user_id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};
import { Request, Response } from 'express';
import { SuspendUserUseCase } from '../../application/SuspendUserUseCase';

const suspendUserUseCase = new SuspendUserUseCase();

export const suspendUser = async (req: Request, res: Response) => {
    try {
        const user_id = parseInt(req.params['id'] as string);
        const result = await suspendUserUseCase.execute(user_id);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
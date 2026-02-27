import { Request, Response } from 'express';
import { UpdateUserUseCase } from '../../application/UpdateUserUseCase';

const updateUserUseCase = new UpdateUserUseCase();

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user_id = parseInt(req.params['id'] as string);

        if (isNaN(user_id)) {
            res.status(400).json({ error: 'ID de usuario inválido' });
            return;
        }

        const result = await updateUserUseCase.execute(user_id, req.body);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};
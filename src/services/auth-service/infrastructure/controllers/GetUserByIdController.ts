import { Request, Response } from 'express';
import { GetUserByIdUseCase } from '../../application/GetUserByIdUseCase';

const getUserByIdUseCase = new GetUserByIdUseCase();

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user_id = parseInt(req.params['id'] as string);

        if (isNaN(user_id)) {
            res.status(400).json({ error: 'ID de usuario inválido' });
            return;
        }

        const user = await getUserByIdUseCase.execute(user_id);
        res.status(200).json(user);
    } catch (error: any) {
        if (error.message === 'Usuario no encontrado') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
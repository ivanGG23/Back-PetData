import { Request, Response } from 'express';
import { CreateComentarioUseCase } from '../../application/CreateComentarioUseCase';

const createComentarioUseCase = new CreateComentarioUseCase();

export const createComentario = async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.headers['usuario_id'] as string);

        if (!usuario_id) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }

        const result = await createComentarioUseCase.execute(req.body, usuario_id);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
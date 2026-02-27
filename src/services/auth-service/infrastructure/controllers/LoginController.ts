import { Request, Response } from 'express';
import { LoginUseCase } from '../../application/LoginUseCase';

const loginUseCase = new LoginUseCase();

export const login = async (req: Request, res: Response) => {
    try {
        const { correo, contrasena } = req.body;
        const result = await loginUseCase.execute(correo, contrasena);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};
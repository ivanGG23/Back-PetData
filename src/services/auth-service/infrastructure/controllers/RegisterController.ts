import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/RegisterUseCase';

const registerUseCase = new RegisterUseCase();

export const register = async (req: Request, res: Response) => {
    try {
        const result = await registerUseCase.execute(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
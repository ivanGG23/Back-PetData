import { Request, Response } from 'express';
import { GetUsuariosUseCase } from '../../application/GetUsuariosUseCase';

const useCase = new GetUsuariosUseCase();

export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const result = await useCase.execute();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
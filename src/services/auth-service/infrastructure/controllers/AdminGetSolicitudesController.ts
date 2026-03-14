import { Request, Response } from 'express';
import { GetSolicitudesUseCase } from '../../application/GetSolicitudesUseCase';

const useCase = new GetSolicitudesUseCase();

export const getSolicitudes = async (req: Request, res: Response) => {
    try {
        const result = await useCase.execute();
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
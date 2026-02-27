import { Request, Response } from 'express';
import { CreateMovimientoUseCase } from '../../application/CreateMovimientoUseCase';

const createMovimientoUseCase = new CreateMovimientoUseCase();

export const createMovimiento = async (req: Request, res: Response) => {
    try {
        const result = await createMovimientoUseCase.execute(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
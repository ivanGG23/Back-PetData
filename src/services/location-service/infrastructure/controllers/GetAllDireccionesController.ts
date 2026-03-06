import { Request, Response } from 'express';
import { GetAllDireccionesUseCase } from '../../application/GetAllDireccionesUseCase';

const useCase = new GetAllDireccionesUseCase();

export class GetAllDireccionesController {
    async run(req: Request, res: Response): Promise<void> {
        try {
            const direcciones = await useCase.execute();
            res.status(200).json(direcciones);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
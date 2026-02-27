import { Request, Response } from 'express';
import { CreateReportUseCase } from '../../application/CreateReportUseCasde';


const createReportUseCase = new CreateReportUseCase();

export const createReport = async (req: Request, res: Response) => {
    try {
        const result = await createReportUseCase.execute(req.body);
        res.status(201).json(result);
    } catch (error: any) {
        if (error.message.includes('límite')) {
            res.status(429).json({ error: error.message });
        } else if (error.message.includes('no válido')) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
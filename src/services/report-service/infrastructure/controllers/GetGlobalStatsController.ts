import { Request, Response } from 'express';
import { GetGlobalStatsUseCase } from '../../application/GetGlobalStatsUseCase';

const getGlobalStatsUseCase = new GetGlobalStatsUseCase();

export const getGlobalStats = async (req: Request, res: Response) => {
    try {
        const stats = await getGlobalStatsUseCase.execute();
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
import { Request, Response } from 'express';
import { GetComentariosUseCase } from '../../application/GetComentariosUseCase';

const getComentariosUseCase = new GetComentariosUseCase();

export const getComentarios = async (req: Request, res: Response) => {
    try {
        const reporte_id = parseInt(req.params['reporte_id'] as string);

        if (isNaN(reporte_id)) {
            res.status(400).json({ error: 'ID de reporte inválido' });
            return;
        }

        const result = await getComentariosUseCase.execute(reporte_id);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
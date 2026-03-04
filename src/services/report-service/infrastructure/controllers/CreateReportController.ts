import { Request, Response } from 'express';
import { CreateReportUseCase } from '../../application/CreateReportUseCase';

const createReportUseCase = new CreateReportUseCase();

export const createReport = async (req: Request, res: Response) => {
    try {
        const archivos = req.files as Express.Multer.File[];
        const usuario_creador_id = parseInt(req.body.usuario_creador_id as string);

        const data = {
            usuario_creador_id,
            estado_animal_id: parseInt(req.body.estado_animal_id),
            prioridad_id: parseInt(req.body.prioridad_id),
            descripcion: req.body.descripcion,
            latitud: parseFloat(req.body.latitud),
            longitud: parseFloat(req.body.longitud),
            precision_metros: req.body.precision_metros ? parseFloat(req.body.precision_metros) : undefined,
            contacto_opcional: req.body.contacto_opcional ?? undefined,
        };

        const result = await createReportUseCase.execute(data, archivos);
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
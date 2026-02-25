import { Request, Response } from "express";
import { SaveLocationUseCase } from "../../application/SaveLocationUseCase";

export class SaveLocationController {
  constructor(private readonly saveLocationUseCase: SaveLocationUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const { reporte_id, latitud, longitud, precision_metros } = req.body;

      const location = await this.saveLocationUseCase.execute({
        reporte_id: Number(reporte_id),
        latitud: Number(latitud),
        longitud: Number(longitud),
        precision_metros: Number(precision_metros),
      });

      res.status(201).json({
        message: "Ubicación guardada correctamente",
        data: location,
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
}
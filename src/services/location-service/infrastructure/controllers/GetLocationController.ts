import { Request, Response } from "express";
import { GetLocationByReportUseCase } from "../../application/GetLocationByReportUseCase";

export class GetLocationController {
  constructor(private readonly getLocationUseCase: GetLocationByReportUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const reporte_id = Number(req.params.reporte_id);

      const location = await this.getLocationUseCase.execute(reporte_id);

      res.status(200).json({
        message: "Ubicación encontrada",
        data: location,
      });
    } catch (error: any) {
      res.status(404).json({
        message: error.message,
      });
    }
  }
}
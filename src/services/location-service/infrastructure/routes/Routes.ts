import { Router } from "express";
import { saveLocationController, getLocationController } from "./dependencies";
import { GetAllDireccionesController } from "../controllers/GetAllDireccionesController";

const getAllDireccionesController = new GetAllDireccionesController();
const router = Router();

router.post("/location", (req, res) => saveLocationController.run(req, res));
router.get('/location/direcciones', (req, res) => getAllDireccionesController.run(req, res));
router.get("/location/:reporte_id", (req, res) => getLocationController.run(req, res));

export default router;
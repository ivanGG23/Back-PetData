import { Router } from "express";
import { saveLocationController, getLocationController } from "./dependencies";

const router = Router();

router.post("/location", (req, res) => saveLocationController.run(req, res));
router.get("/location/:reporte_id", (req, res) => getLocationController.run(req, res));

export default router;
import express from 'express';
import { createHistorial, getHistorial } from '../controllers/HistorialController';
import { createEvidencia, getEvidencia } from '../controllers/EvidenciaController';

const router = express.Router();

router.post('/tracking/historial', createHistorial);
router.get('/tracking/historial/:reporte_id', getHistorial);
router.post('/tracking/evidencia', createEvidencia);
router.get('/tracking/evidencia/:reporte_id', getEvidencia);

export default router;
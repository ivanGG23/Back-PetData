import express from 'express';
import { createReport } from '../controllers/CreateReportController';
import { getReports } from '../controllers/GetReportsController';
import { getReportById } from '../controllers/GetReportByIdController';
import { changeReportStatus } from '../controllers/ChangeReportStatusController';
import { updateReport } from '../controllers/UpdateReportController';
import { addEvidencia } from '../controllers/AddEvidenciaController';
import { asignarReporte } from '../controllers/AsignarReporteController';
import { desasignarReporte } from '../controllers/DesasignarReporteController';
import { getHeatmap } from '../controllers/GetHeatmapController';
import { getUserStats } from '../controllers/GetUserStatsController';
import { upload } from '../middlewares/upload';
import { getGlobalStats } from '../controllers/GetGlobalStatsController';

const router = express.Router();

// Rutas estáticas primero, antes de las rutas con parámetros (:id)
router.post('/reports', upload.array('imagenes', 3), createReport);
router.get('/reports', getReports);
router.post('/reports/evidencia', upload.array('imagenes', 3), addEvidencia);
router.get('/reports/heatmap', getHeatmap);
router.get('/reports/users/:usuario_id/stats', getUserStats);
router.get('/reports/stats/global', getGlobalStats);

// Rutas con parámetros al final
router.get('/reports/:id', getReportById);
router.put('/reports/:id/estado', changeReportStatus);
router.put('/reports/:id', updateReport);
router.post('/reports/:id/asignar', asignarReporte);
router.delete('/reports/:id/asignar', desasignarReporte);

export default router;
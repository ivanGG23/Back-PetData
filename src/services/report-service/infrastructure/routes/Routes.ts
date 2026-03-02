import express from 'express';
import { createReport } from '../controllers/CreateReportController';
import { getReports } from '../controllers/GetReportsController';
import { getReportById } from '../controllers/GetReportByIdController';
import { changeReportStatus } from '../controllers/ChangeReportStatusController';
import { updateReport } from '../controllers/UpdateReportController';
import { addEvidencia } from '../controllers/AddEvidenciaController';
import { asignarReporte } from '../controllers/AsignarReporteController';
import { desasignarReporte } from '../controllers/DesasignarReporteController';

const router = express.Router();

router.post('/reports', createReport);
router.get('/reports', getReports);
router.get('/reports/:id', getReportById);
router.put('/reports/:id/estado', changeReportStatus);
router.put('/reports/:id', updateReport);
router.post('/reports/evidencia', addEvidencia);
router.post('/reports/:id/asignar', asignarReporte);
router.delete('/reports/:id/desasignar', desasignarReporte);

export default router;
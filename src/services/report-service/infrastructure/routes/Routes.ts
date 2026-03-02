import express from 'express';
import { createReport } from '../controllers/CreateReportController';
import { getReports } from '../controllers/GetReportsController';
import { getReportById } from '../controllers/GetReportByIdController';
import { changeReportStatus } from '../controllers/ChangeReportStatusController';
import { updateReport } from '../controllers/UpdateReportController';
import { addEvidencia } from '../controllers/AddEvidenciaController';

const router = express.Router();

router.post('/reports', createReport);
router.get('/reports', getReports);
router.get('/reports/:id', getReportById);
router.put('/reports/:id/estado', changeReportStatus);
router.put('/reports/:id', updateReport);
router.post('/reports/evidencia', addEvidencia);

export default router;
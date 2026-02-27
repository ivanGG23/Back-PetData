import express from 'express';
import { createReport } from '../controllers/CreateReportController';
import { getReports } from '../controllers/GetReportsController';
import { getReportById } from '../controllers/GetReportByIdController';

const router = express.Router();

router.post('/reports', createReport);
router.get('/reports', getReports);
router.get('/reports/:id', getReportById);

export default router;
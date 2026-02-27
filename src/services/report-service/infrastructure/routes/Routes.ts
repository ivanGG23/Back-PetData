import express from 'express';
import { createReport } from '../controllers/CreateReportController';

const router = express.Router();

router.post('/reports', createReport);

export default router;
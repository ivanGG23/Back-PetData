import express from 'express';
import { createMovimiento } from '../controllers/CreateMovimientoController';
import { getReputacion } from '../controllers/GetReputacionController';

const router = express.Router();

router.post('/reputation', createMovimiento);
router.get('/reputation/:usuario_id', getReputacion);

export default router;
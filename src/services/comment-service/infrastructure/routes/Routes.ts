import { Router } from 'express';
import { createComentario } from '../controllers/CreateComentarioController';
import { getComentarios } from '../controllers/GetComentariosController';

const router = Router();

router.post('/comments', createComentario);
router.get('/comments/:reporte_id', getComentarios);

export default router;
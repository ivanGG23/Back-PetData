import { Router, Request, Response } from 'express';
import { verificarToken } from '../middlewares/jwt_middleware';
import axios from 'axios';

const router = Router();

// ─── AUTH (sin token) ─────────────────────────────────────
router.post('/auth/register', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.AUTH_SERVICE_URL}/auth/register`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

router.post('/auth/login', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.AUTH_SERVICE_URL}/auth/login`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

router.get('/auth/google', async (req: Request, res: Response) => {
    res.redirect(`${process.env.AUTH_SERVICE_URL}/auth/google`);
});

// ─── REPORTS (con token) ──────────────────────────────────
router.post('/reports', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.REPORT_SERVICE_URL}/reports`,
            {
                ...req.body,
                usuario_creador_id: req.usuario!.user_id, // Inyectamos el user_id del token
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

export default router;
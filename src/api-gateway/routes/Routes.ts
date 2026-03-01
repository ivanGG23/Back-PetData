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

// GET todos los reportes con filtros opcionales
router.get('/reports', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.REPORT_SERVICE_URL}/reports`,
            { params: req.query }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// GET reporte por ID
router.get('/reports/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.REPORT_SERVICE_URL}/reports/${req.params['id']}`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Cambiar estado de reporte
router.put('/reports/:id/estado', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.put(
            `${process.env.REPORT_SERVICE_URL}/reports/${req.params['id']}/estado`,
            req.body,
            {
                headers: {
                    usuario_id: req.usuario!.user_id,
                    rol_id: req.usuario!.rol_id,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Editar reporte
router.put('/reports/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.put(
            `${process.env.REPORT_SERVICE_URL}/reports/${req.params['id']}`,
            req.body,
            {
                headers: {
                    usuario_id: req.usuario!.user_id,
                    rol_id: req.usuario!.rol_id,
                },
            }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Registrar movimiento de reputación | (deshabilitado por ahora, se hará internamente en el servicio de reportes)
/*
router.post('/reputation', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.REPUTATION_SERVICE_URL}/reputation`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});
*/

// Obtener reputación de un usuario
router.get('/reputation/:usuario_id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.REPUTATION_SERVICE_URL}/reputation/${req.params['usuario_id']}`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Historial de estados
router.post('/tracking/historial', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.TRACKING_SERVICE_URL}/tracking/historial`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

router.get('/tracking/historial/:reporte_id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.TRACKING_SERVICE_URL}/tracking/historial/${req.params['reporte_id']}`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Evidencia
router.post('/tracking/evidencia', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia`,
            req.body
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

router.get('/tracking/evidencia/:reporte_id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.TRACKING_SERVICE_URL}/tracking/evidencia/${req.params['reporte_id']}`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

export default router;
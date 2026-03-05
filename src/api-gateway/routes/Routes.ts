import { Router, Request, Response } from 'express';
import { verificarToken } from '../middlewares/jwt_middleware';
import axios from 'axios';
import multer from 'multer';

const router = Router();
const uploadGateway = multer({ storage: multer.memoryStorage() });

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

router.post('/reports', verificarToken, uploadGateway.array('imagenes', 3), async (req: Request, res: Response) => {
    try {
        const FormData = require('form-data');
        const form = new FormData();

        const archivos = req.files as Express.Multer.File[];

        if (!archivos || archivos.length === 0) {
            res.status(400).json({ error: 'Se requiere al menos una imagen' });
            return;
        }

        // Reenviar archivos
        archivos.forEach(archivo => {
            form.append('imagenes', archivo.buffer, {
                filename: archivo.originalname,
                contentType: archivo.mimetype,
            });
        });

        // Reenviar campos de texto
        form.append('usuario_creador_id', req.usuario!.user_id.toString());
        form.append('estado_animal_id', req.body.estado_animal_id);
        form.append('tipo_animal_id', req.body.tipo_animal_id);
        form.append('prioridad_id', req.body.prioridad_id);
        form.append('descripcion', req.body.descripcion);
        form.append('latitud', req.body.latitud);
        form.append('longitud', req.body.longitud);
        if (req.body.precision_metros) form.append('precision_metros', req.body.precision_metros);
        if (req.body.contacto_opcional) form.append('contacto_opcional', req.body.contacto_opcional);

        const response = await axios.post(
            `${process.env.REPORT_SERVICE_URL}/reports`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                },
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

router.post('/reports/evidencia', verificarToken, uploadGateway.array('imagenes', 3), async (req: Request, res: Response) => {
    try {
        const FormData = require('form-data');
        const form = new FormData();

        const archivos = req.files as Express.Multer.File[];

        if (!archivos || archivos.length === 0) {
            res.status(400).json({ error: 'No se enviaron imágenes' });
            return;
        }

        // Reenviar archivos
        archivos.forEach(archivo => {
            form.append('imagenes', archivo.buffer, {
                filename: archivo.originalname,
                contentType: archivo.mimetype,
            });
        });

        // Reenviar reporte_id desde el body ya parseado por multer
        const reporte_id = req.body?.reporte_id;
        
        if (!reporte_id) {
            res.status(400).json({ error: 'reporte_id es requerido' });
            return;
        }

        form.append('reporte_id', reporte_id);
        if (req.body?.tipo) form.append('tipo', req.body.tipo);

        const response = await axios.post(
            `${process.env.REPORT_SERVICE_URL}/reports/evidencia`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
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

// Asignar rescatista
router.post('/reports/:id/asignar', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.REPORT_SERVICE_URL}/reports/${req.params['id']}/asignar`,
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

// Desasignar rescatista
router.delete('/reports/:id/asignar', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.delete(
            `${process.env.REPORT_SERVICE_URL}/reports/${req.params['id']}/asignar`,
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

// Ruta para las coordenadas de mapas
router.get('/reports/heatmap', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.REPORT_SERVICE_URL}/reports/heatmap`,
            { params: req.query }
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Comments
router.post('/comments', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.post(
            `${process.env.COMMENT_SERVICE_URL}/comments`,
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

router.get('/comments/:reporte_id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.COMMENT_SERVICE_URL}/comments/${req.params['reporte_id']}`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

// Agrega esta ruta junto a las demás de /auth
router.get('/auth/users/:id', verificarToken, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(
            `${process.env.AUTH_SERVICE_URL}/auth/users/${req.params['id']}`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

router.get('/reports/users/:usuario_id/stats', verificarToken, async (req, res) => {
    try {
        const response = await axios.get(
            `${process.env.REPORT_SERVICE_URL}/reports/users/${req.params['usuario_id']}/stats`
        );
        res.status(response.status).json(response.data);
    } catch (error: any) {
        res.status(error.response?.status || 500).json(error.response?.data);
    }
});

export default router;
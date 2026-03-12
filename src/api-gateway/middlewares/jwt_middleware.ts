import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface TokenPayload {
    user_id: number;
    rol_id: number;
    correo: string;
}

// Extendemos el tipo de Request para incluir el usuario del token
declare global {
    namespace Express {
        interface Request {
            usuario?: TokenPayload;
        }
    }
}

export const verificarToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as TokenPayload;

        console.log('Payload del token:', payload);

        req.usuario = payload;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};
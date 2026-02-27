import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '../domain/dto/AuthResponse';

const prisma = new PrismaClient();

export class LoginUseCase {
    async execute(correo: string, contrasena: string): Promise<AuthResponse> {
        const user = await prisma.uSER.findUnique({
            where: { correo },
        });

        if (!user) {
            throw new Error('Correo o contraseña incorrectos');
        }

        if (user.auth_provider === 'google') {
            throw new Error('Esta cuenta usa inicio de sesión con Google');
        }

        if (user.estado_cuenta === 'suspendido') {
            throw new Error('Tu cuenta está suspendida');
        }

        // Verificar contraseña
        const contrasenaValida = await bcrypt.compare(
            contrasena,
            user.contrasena_hash!
        );

        if (!contrasenaValida) {
            throw new Error('Correo o contraseña incorrectos');
        }

        // Generar token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                rol_id: user.rol_id,
                correo: user.correo,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        return {
            token,
            user: {
                user_id: user.user_id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                rol_id: user.rol_id,
            },
        };
    }
}
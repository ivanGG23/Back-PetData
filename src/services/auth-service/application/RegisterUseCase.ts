import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterRequest } from '../domain/dto/RegisterRequest';
import { AuthResponse } from '../domain/dto/AuthResponse';

const prisma = new PrismaClient();

export class RegisterUseCase {
    async execute(data: RegisterRequest): Promise<AuthResponse> {
        const existingUser = await prisma.uSER.findUnique({
            where: { correo: data.correo },
        });

        if (existingUser) {
            throw new Error('El correo ya está registrado');
        }

        // Encriptar contraseña
        const contrasena_hash = await bcrypt.hash(data.contrasena, 10);

        const user = await prisma.uSER.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                contrasena_hash,
                telefono: data.telefono ?? null,
                fecha_nacimiento: data.fecha_nacimiento
                    ? new Date(data.fecha_nacimiento)
                    : null,
                rol_id: 1,
                auth_provider: 'local',
                estado_cuenta: 'activo',
                correo_verificado: false,
            },
        });

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
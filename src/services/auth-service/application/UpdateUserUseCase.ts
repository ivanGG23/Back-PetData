import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface UpdateUserRequest {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    fecha_nacimiento?: string;
    contrasena?: string;
}

export class UpdateUserUseCase {
    async execute(user_id: number, data: UpdateUserRequest) {
        // Verificar que el usuario existe
        const user = await prisma.uSER.findUnique({
            where: { user_id },
        });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (user.estado_cuenta === 'inactivo') {
            throw new Error('No se puede editar una cuenta eliminada');
        }

        // Si viene nueva contraseña la encriptamos
        let contrasena_hash = undefined;
        if (data.contrasena) {
            if (user.auth_provider === 'google') {
                throw new Error('Las cuentas de Google no pueden cambiar contraseña');
            }
            contrasena_hash = await bcrypt.hash(data.contrasena, 10);
        }

        const updatedUser = await prisma.uSER.update({
            where: { user_id },
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                telefono: data.telefono,
                fecha_nacimiento: data.fecha_nacimiento
                    ? new Date(data.fecha_nacimiento)
                    : undefined,
                contrasena_hash,
            },
        });

        return {
            user_id: updatedUser.user_id,
            nombre: updatedUser.nombre,
            apellido: updatedUser.apellido,
            correo: updatedUser.correo,
            telefono: updatedUser.telefono,
            fecha_nacimiento: updatedUser.fecha_nacimiento,
            rol_id: updatedUser.rol_id,
        };
    }
}
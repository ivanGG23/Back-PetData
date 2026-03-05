import jwt from 'jsonwebtoken';

export class GoogleLoginUseCase {
    execute(user: any): string {
        const token = jwt.sign(
            {
                user_id: user.user_id,
                rol_id: user.rol_id,
                correo: user.correo,
                nombre: user.nombre,
                apellido: user.apellido,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );
        return token;
    }
}
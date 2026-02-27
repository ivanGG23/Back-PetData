export interface AuthResponse {
    token: string;
    user: {
        user_id: number;
        nombre: string;
        apellido: string;
        correo: string;
        rol_id: number;
    };
}
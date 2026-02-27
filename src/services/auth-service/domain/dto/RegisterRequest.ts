export interface RegisterRequest {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    telefono?: string;
    fecha_nacimiento?: string;
}
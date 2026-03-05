import { Request, Response } from 'express';
import { GoogleLoginUseCase } from '../../application/GoogleLoginUseCase';

const googleLoginUseCase = new GoogleLoginUseCase();

export const googleCallback = (req: Request, res: Response) => {
    const token = googleLoginUseCase.execute(req.user);
    // Temporal para pruebas hasta tener la app movil
    //res.json({ message: "Inicio de sesión correcto" });

    // Aqui se envia el token al front
    // Cuando se defina el front, cambiar la URL (patitasseguras://auth?token=${token}) por el del front
    res.redirect(`PetData://auth?token=${token}`);
};
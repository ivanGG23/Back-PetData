import express from 'express';
import passport from '../adapters/GoogleStrategy';
import { googleCallback } from '../controllers/GoogleAuthController';
import { login } from '../controllers/LoginController';
import { register } from '../controllers/RegisterController';
import { updateUser } from '../controllers/UpdateUserController';
import { deleteUser } from '../controllers/DeleteUserController';
import { suspendUser } from '../controllers/SuspendUserController';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.put('/auth/user/:id', updateUser);
router.delete('/auth/user/:id', deleteUser);
router.post('/auth/user/:id/suspend', suspendUser);

// Ruta que inicia el flujo de Google
router.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Ruta a la que Google regresa después de autenticar
router.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/auth/error' }),
    googleCallback
);

export default router;
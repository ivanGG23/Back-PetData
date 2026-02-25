import express from 'express';
import passport from '../adapters/GoogleStrategy';
import { googleCallback } from '../controllers/GoogleAuthController';

const router = express.Router();

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
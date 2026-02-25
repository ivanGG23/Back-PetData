import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const correo = profile.emails?.[0].value!;
                const google_id = profile.id;
                const avatar_url = profile.photos?.[0].value ?? null;
                const nombre = profile.name?.givenName ?? '';
                const apellido = profile.name?.familyName ?? '';

                // Busca si ya existe el usuario por google_id o por correo
                let user = await prisma.uSER.findFirst({
                    where: {
                        OR: [{ google_id }, { correo }],
                    },
                });

                if (user) {
                    // Si existe pero no tiene google_id vinculado, lo vincula
                    if (!user.google_id) {
                        user = await prisma.uSER.update({
                            where: { user_id: user.user_id },
                            data: { google_id, avatar_url, auth_provider: 'google' },
                        });
                    }
                } else {
                    // Si no existe, crea el usuario nuevo
                    user = await prisma.uSER.create({
                        data: {
                            rol_id: 1, // ciudadano por defecto
                            nombre,
                            apellido,
                            correo,
                            google_id,
                            avatar_url,
                            auth_provider: 'google',
                            estado_cuenta: 'activo',
                            correo_verificado: true, // Google ya lo verificó
                        },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, undefined);
            }
        }
    )
);

export default passport;
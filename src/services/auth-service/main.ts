import 'dotenv/config';
import express from 'express';
import passport from './infrastructure/adapters/GoogleStrategy';
import router from './infrastructure/routes/Routes';

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'auth-service' });
});

app.use(router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`auth-service corriendo en puerto ${PORT}`);
});
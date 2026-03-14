import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import router from './routes/Routes';

const app = express();

app.use(cors({
    origin: 'https://administrador-pet-data.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`api-gatew  ay corriendo en puerto ${PORT}`);
});
import 'dotenv/config';
import express from 'express';
import router from './infrastructure/routes/Routes';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'reputation-service' });
});

app.use(router);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`reputation-service corriendo en puerto ${PORT}`);
});
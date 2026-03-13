import 'dotenv/config';
import express from 'express';
import router from './infrastructure/routes/Routes';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'report-service' });
});

app.use(router);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`report-service corriendo en puerto ${PORT}`);
});
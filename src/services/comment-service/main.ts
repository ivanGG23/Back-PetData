import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDB } from './infrastructure/database/ConnMongoDB';
import router from './infrastructure/routes/Routes';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'comment-service' });
});

app.use(router);

const PORT = process.env.PORT || 3006;

connectMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`comment-service corriendo en puerto ${PORT}`);
    });
});
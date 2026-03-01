import 'dotenv/config';
import express from 'express';
import { connectMongoDB } from './infrastructure/database/ConnMongoDB';
import router from './infrastructure/routes/Routes';

const app = express();

app.use(express.json());
app.use(router);

const PORT = process.env.PORT || 3005;

connectMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`tracking-service corriendo en puerto ${PORT}`);
    });
});
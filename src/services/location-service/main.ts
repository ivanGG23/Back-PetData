import express from "express";
import router from "./infrastructure/routes/Routes";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'location-service' });
});

app.use(router);

app.listen(PORT, () => {
  console.log(`location-service corriendo en puerto ${PORT}`);
});
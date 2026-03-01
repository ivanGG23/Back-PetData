import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log('Conectado a MongoDB correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};
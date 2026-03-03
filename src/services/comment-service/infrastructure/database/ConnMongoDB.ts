import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/patitasseguras');
        console.log('MongoDB conectado en comment-service');
    } catch (error) {
        console.error('Error conectando MongoDB:', error);
        process.exit(1);
    }
};
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const subirImagen = (buffer: Buffer, carpeta: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `petdata/${carpeta}` },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
};
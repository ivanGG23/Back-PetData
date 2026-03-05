import multer from 'multer';

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 5 * 1024 * 1024,
        fieldSize: 5 * 1024 * 1024,
        fields: 20  // ← permite más campos de texto
    },
    fileFilter: (_, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
        }
    },
});
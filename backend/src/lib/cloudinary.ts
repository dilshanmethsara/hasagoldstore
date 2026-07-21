import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: 'hasagoldstore/games',
    format: path.extname(file.originalname).slice(1) || 'jpg',
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  }),
});

export const upload = multer({ storage });

export { cloudinary };

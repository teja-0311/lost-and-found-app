import { config } from 'dotenv';
config();

export const API_BASE_URL = process.env.API_BASE_URL;
export const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL;

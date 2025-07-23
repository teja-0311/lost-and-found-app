import { config } from 'dotenv';
config();

export const API_BASE_URL = 'http://192.168.2.9:5000';
export const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL;


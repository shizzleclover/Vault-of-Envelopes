import { v2 as cloudinary } from 'cloudinary';

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

console.log('Cloudinary Config Check:');
console.log('Cloud Name present:', !!process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key present:', !!process.env.CLOUDINARY_API_KEY);
console.log('API Secret present:', !!process.env.CLOUDINARY_API_SECRET);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;

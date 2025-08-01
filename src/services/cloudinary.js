import dotenv from 'dotenv'
import path from 'path'
dotenv.config({path:path.resolve('./Config/.env')})

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.SECRET_KEY
});
export default cloudinary
/* eslint-disable class-methods-use-this */
import cloudinary from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

class CloudinaryUpload {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  public dirname(name: string): multer.Multer {
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary.v2,
      params: () => ({
        folder: name,
        format: 'jpeg',
      }),
    });

    return multer({ storage });
  }
}

const multerUpload = new CloudinaryUpload();

export default multerUpload;

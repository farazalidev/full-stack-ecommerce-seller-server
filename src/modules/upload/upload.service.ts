import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from 'src/utils/cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  async uploadThumbnailImage(
    file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
        if (err) {
          console.log(err);

          return reject(err);
        }
        resolve(result);
      });
      streamifier.createReadStream(file?.buffer).pipe(uploadStream);
    });
  }

  //remove thumbnail image
  async removeThumbnailImage(public_id: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(
        public_id,
        { resource_type: 'image' },
        (err, result) => {
          if (err) {
            console.log(err);

            return reject(err);
          }
          console.log(result);

          resolve(result);
        },
      );
    });
  }

  async uploadOtherImages(
    file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
        if (err) {
          console.log(err);

          return reject(err);
        }
        resolve(result);
      });
      streamifier.createReadStream(file?.buffer).pipe(uploadStream);
    });
  }

  async removeOtherImage(public_id: string): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      cloudinary.uploader.destroy(
        public_id,
        { resource_type: 'image' },
        (err, result) => {
          if (err) {
            console.log(err);

            return reject(err);
          }
          console.log(result);

          resolve(result);
        },
      );
    });
  }
}

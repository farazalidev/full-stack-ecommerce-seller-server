import { Injectable } from "@nestjs/common";
import { CloudinaryResponse } from "src/utils/cloudinary-response";
import { v2 as cloudinary } from "cloudinary";
import * as streamifier from "streamifier";
import { InjectRepository } from "@nestjs/typeorm";
import { SellerEntity } from "../seller/entities/seller.entity";
import { Repository } from "typeorm";
import { CustomError } from "src/utils/ErrorInterface";

@Injectable()
export class UploadService {
     constructor(@InjectRepository(SellerEntity) private sellerRepo: Repository<SellerEntity>) {}

     async uploadDescriptionImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
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

     //remove Description image
     async removeCloudImage(public_id: string): Promise<CloudinaryResponse> {
          return new Promise<CloudinaryResponse>((resolve, reject) => {
               cloudinary.uploader.destroy(public_id, { resource_type: "image" }, (err, result) => {
                    if (err) {
                         return reject(err);
                    }
                    resolve(result);
               });
          });
     }

     async uploadProductImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
          return new Promise<CloudinaryResponse>((resolve, reject) => {
               const uploadStream = cloudinary.uploader.upload_stream((err, result) => {
                    if (err) {
                         reject(err);
                    }
                    resolve(result);
               });

               streamifier.createReadStream(file?.buffer).pipe(uploadStream);
          });
     }

     async removeImageFromGallery(public_id: string, seller_id: string): Promise<CustomError<{ public_id: string }>> {
          try {
               const foundedSeller = await this.sellerRepo.findOne({ where: { seller_id } });
               const filteredImages = foundedSeller.gallery_images.images.filter((img) => img.public_id !== public_id);
               foundedSeller.gallery_images.images = filteredImages;
               await this.sellerRepo.save(foundedSeller);
               return {
                    data: { public_id },
                    success: true,
               };
          } catch (error) {
               console.log(error);
               return {
                    data: undefined,
                    success: false,
                    error: { message: "Error While deleting image", statusCode: 500 },
               };
          }
     }
}

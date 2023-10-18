import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { CloudinaryResponse } from 'src/utils/cloudinary-response';
import { v2 as cloudinary } from 'cloudinary';

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/upload/product-thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnailImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return this.uploadService.uploadThumbnailImage(file);
  }
  @Post('/upload/remove-thumbnail')
  async RemoveThumbnailImage(@Body() body): Promise<CloudinaryResponse> {
    console.log(body?.public_id);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return this.uploadService.removeThumbnailImage(body?.public_id);
  }

  @Post('/upload/other-images')
  @UseInterceptors(FileInterceptor('other-images'))
  async uploadOtherImages(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return this.uploadService.uploadOtherImages(file);
  }

  @Post('/upload/remove-other-image')
  async RemoveOtherImage(@Body() body): Promise<CloudinaryResponse> {
    console.log(body?.public_id);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return this.uploadService.removeOtherImage(body?.public_id);
  }
}

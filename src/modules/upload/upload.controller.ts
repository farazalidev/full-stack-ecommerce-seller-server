import { Body, Controller, HttpException, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { CloudinaryResponse } from "src/utils/cloudinary-response";
import { authGuard } from "../seller/auth.guard";

@Controller()
export class UploadController {
     constructor(private readonly uploadService: UploadService) {}

     @Post("/upload/description-images")
     @UseInterceptors(FileInterceptor("description_image"))
     async uploadThumbnailImage(@UploadedFile() file: Express.Multer.File): Promise<{ location: string }> {
          const response = await this.uploadService.uploadDescriptionImage(file);
          return {
               location: response.url,
          };
     }
     @Post("/upload/remove-description-image")
     async RemoveThumbnailImage(@Body() body): Promise<CloudinaryResponse> {
          return this.uploadService.removeCloudImage(body?.public_id);
     }

     @Post("/upload/product-image")
     @UseInterceptors(FileInterceptor("product-image"))
     async uploadProductImage(
          @UploadedFile() file: Express.Multer.File,
     ): Promise<{ url: string; public_id: string; bytes: string; name: string; uploaded_on: Date }> {
          console.log(file);

          const response = await this.uploadService.uploadProductImage(file);

          return {
               public_id: response.public_id,
               url: response.url,
               bytes: response.bytes,
               name: response.original_filename,
               uploaded_on: response.created_at,
          };
     }

     @Post("upload/remove-gallery-image")
     @UseGuards(authGuard)
     async removeImageFromGallery(@Req() req, @Body() body): Promise<{ public_id: string }> {
          const response = await this.uploadService.removeImageFromGallery(body.public_id, req.seller);
          if (!response.success) {
               throw new HttpException(response.error.message, response.error.statusCode);
          }
          return response.data;
     }

     @Post("upload/remove-upload")
     async removeUpload(@Body() body): Promise<CloudinaryResponse> {
          console.log(body.public_id);

          return await this.uploadService.removeCloudImage(body.public_id);
     }
}

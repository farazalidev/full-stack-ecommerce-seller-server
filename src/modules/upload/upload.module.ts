import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { CloudinaryProvider } from "./cloudnary.provider";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SellerEntity } from "../seller/entities/seller.entity";
@Module({
     imports: [TypeOrmModule.forFeature([SellerEntity])],
     controllers: [UploadController],
     providers: [CloudinaryProvider, UploadService],
     exports: [UploadService],
})
export class UploadModule {}

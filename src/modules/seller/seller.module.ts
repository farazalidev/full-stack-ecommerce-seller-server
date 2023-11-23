import { Module } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SellerEntity } from "./entities/seller.entity";
import { SellerController } from "./seller.controller";
import { sellerAddressEntity } from "./entities/sellerAddress.entity";
import { Seller_storeEntity } from "./entities/sellerStore.entity";
import { ProductModule } from "../product/product.module";
import { GalleryImagesEntity } from "./entities/galleryImages.entity";
import { authGuard } from "./auth.guard";

@Module({
     imports: [
          TypeOrmModule.forFeature([
               SellerEntity,
               sellerAddressEntity,
               Seller_storeEntity,
               ProductModule,
               GalleryImagesEntity,
          ]),
     ],
     providers: [SellerService, authGuard],
     controllers: [SellerController],
})
export class AuthModule {}

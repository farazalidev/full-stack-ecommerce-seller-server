import { Module } from "@nestjs/common";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";
import { ProductEntity } from "./entities/product.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Seller_storeEntity } from "../seller/entities/sellerStore.entity";
import { SellerEntity } from "../seller/entities/seller.entity";

@Module({
     imports: [TypeOrmModule.forFeature([ProductEntity, Seller_storeEntity, SellerEntity])],
     providers: [ProductResolver, ProductService],
})
export class ProductModule {}

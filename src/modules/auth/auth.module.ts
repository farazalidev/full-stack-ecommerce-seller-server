import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellerEntity } from './entities/seller.entity.';
import { AuthController } from './auth.controller';
import { sellerAddressEntity } from './entities/sellerAddress.entity';
import { Seller_storeEntity } from './entities/sellerStore.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerEntity,
      sellerAddressEntity,
      Seller_storeEntity,
    ]),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

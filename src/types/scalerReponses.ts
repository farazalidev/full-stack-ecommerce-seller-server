import { Field, ObjectType } from "@nestjs/graphql";
import { Seller_storeEntity } from "src/modules/seller/entities/sellerStore.entity";

@ObjectType()
export class storeInfoResponse {
     @Field(() => [Seller_storeEntity])
     stores: Seller_storeEntity[];

     @Field(() => Seller_storeEntity)
     selectedStore: Seller_storeEntity;
}

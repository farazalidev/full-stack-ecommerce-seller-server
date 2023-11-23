import { Field, ObjectType } from "@nestjs/graphql";
import { Seller_storeEntity } from "src/modules/seller/entities/sellerStore.entity";

@ObjectType()
export class StoreInfoResponse {
     @Field(() => Seller_storeEntity)
     store: Seller_storeEntity[];
}

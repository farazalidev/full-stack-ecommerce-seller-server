import { Field, ObjectType } from "@nestjs/graphql";
import { SellerEntity } from "src/modules/seller/entities/seller.entity";
import { Seller_storeEntity } from "src/modules/seller/entities/sellerStore.entity";
import { ImagesArray } from "src/types/misc";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

@ObjectType()
class ThumbnailType {
     @Field()
     url: string;

     @Field()
     uid: string;

     @Field()
     name: string;
}

@Entity({ name: "product" })
@ObjectType({ description: "Add a new Product" })
export class ProductEntity {
     @Field()
     @PrimaryColumn({})
     product_id: string = v4();

     @Field()
     @Column({ nullable: true })
     product_name: string;

     @Field()
     @Column()
     description: string;

     @Field(() => [ImagesArray])
     @Column({ type: "jsonb", nullable: true })
     images?: ImagesArray[];

     @Field()
     @Column()
     manufacturer: string;

     @Field()
     @Column()
     price: number;

     @Field()
     @Column()
     product_category: string;

     @Field()
     @Column()
     stock: number;

     @Field({ nullable: true })
     @Column({ nullable: true })
     discount?: number;

     @Field(() => ThumbnailType)
     @Column({ type: "jsonb" })
     thumbnail: { url: string; uid: string; name: string };

     @Field(() => Seller_storeEntity)
     @ManyToOne(() => Seller_storeEntity, (seller_store) => seller_store.products)
     store: Seller_storeEntity;

     @Field(() => SellerEntity)
     @ManyToOne(() => SellerEntity, (seller) => seller.products)
     seller: SellerEntity;
}

import { AfterLoad, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import { SellerEntity } from "./seller.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { Field, ObjectType } from "@nestjs/graphql";

@Entity({ name: "store" })
@ObjectType({ description: "seller_store entity" })
export class Seller_storeEntity {
     @Field()
     @PrimaryColumn({ type: "uuid" })
     store_id: string = v4();

     @Field()
     @Column({ type: "varchar" })
     store_name: string;

     @Field()
     @Column({ type: "varchar" })
     store_location: string;

     @Field()
     @Column({ type: "varchar" })
     store_category: string;

     @Field()
     @Column({ type: "varchar" })
     store_phone: number;

     @OneToMany(() => ProductEntity, (product) => product.store, {
          cascade: true,
          nullable: true,
     })
     products: ProductEntity[];

     @Field(() => SellerEntity)
     @ManyToOne(() => SellerEntity, (seller) => seller.store)
     seller: SellerEntity;

     //add product
     @AfterLoad()
     addProduct(product: ProductEntity) {
          if (!this.products) {
               this.products = [];
          }

          this.products.push(product);
     }
}

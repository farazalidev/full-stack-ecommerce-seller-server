import { AfterLoad, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";
import { sellerAddressEntity } from "./sellerAddress.entity";
import { Seller_storeEntity } from "./sellerStore.entity";
import { ProductEntity } from "src/modules/product/entities/product.entity";
import { Field, ObjectType } from "@nestjs/graphql";
import { GalleryImagesEntity } from "./galleryImages.entity";

@ObjectType()
@Entity({ name: "seller" })
export class SellerEntity {
     @Field()
     @PrimaryColumn({ type: "uuid" })
     seller_id: string = v4();

     @Field()
     @Column({ type: "varchar" })
     seller_name: string;

     @Field()
     @Column({ type: "varchar" })
     seller_email: string;

     @Field()
     @Column({ type: "varchar" })
     seller_password: string;

     @Field()
     @Column({ type: "date" })
     seller_join_date?: Date = new Date();

     @Field()
     @Column({ type: "boolean", default: false })
     isConfirmed: boolean = false;

     @Field(() => sellerAddressEntity)
     @OneToOne(
          () => sellerAddressEntity,
          (seller) => {
               seller.address_id;
          },
          { cascade: true, eager: true },
     )
     @JoinColumn({ name: "seller_address" })
     seller_address: sellerAddressEntity;

     @OneToMany(() => Seller_storeEntity, (store) => store.seller, {
          cascade: true,
          eager: true,
     })
     store: Seller_storeEntity[];

     @Column({ nullable: true })
     selected_store: string;

     @OneToMany(() => ProductEntity, (product) => product.seller, { eager: true })
     products: ProductEntity[];

     @OneToOne(() => GalleryImagesEntity, (gallery) => gallery.gallery_id, { cascade: true, eager: true })
     @JoinColumn({ name: "seller_gallery_images" })
     gallery_images: GalleryImagesEntity;

     //add store
     @AfterLoad()
     addNewStore(store: Seller_storeEntity) {
          if (!this.store) {
               this.store = [];
          }
          this.store.push(store);
     }
}

import { ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

@ObjectType()
@Entity({ name: "seller_images_gallery" })
export class GalleryImagesEntity {
     @PrimaryColumn({ type: "uuid" })
     gallery_id: string = v4();

     @Column({ type: "jsonb", nullable: true })
     images: { url: string; public_id: string; bytes: number; uploaded_on: Date }[] = [];
}

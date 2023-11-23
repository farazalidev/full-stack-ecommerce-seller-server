import { Field, InputType } from "@nestjs/graphql";
import { imagesArrayInput } from "src/types/misc";

@InputType()
class Thumbnail {
  @Field(() => String)
  url: string;

  @Field(() => String)
  uid: string;

  @Field(() => String)
  name: string;
}

@InputType()
export class addNewProductInput {
  @Field()
  product_name: string;

  @Field()
  description: string;

  @Field(() => [imagesArrayInput])
  images: imagesArrayInput[];

  @Field()
  manufacturer: string;

  @Field()
  price: number;

  @Field()
  product_category: string;

  @Field()
  stock: number;

  @Field({ nullable: true })
  discount?: number;

  @Field(() => Thumbnail)
  thumbnail: Thumbnail;
}

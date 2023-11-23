import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ImagesArray {
  @Field(() => String)
  url: string;

  @Field(() => String)
  uid: string;

  @Field(() => String)
  name: string;
}

@InputType()
export class imagesArrayInput {
  @Field(() => String)
  url: string;

  @Field(() => String)
  uid: string;

  @Field(() => String)
  name: string;
}

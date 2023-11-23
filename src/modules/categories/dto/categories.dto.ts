import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
class subCategoriesScaler {
     @Field(() => String)
     subCategoryName: string;

     @Field(() => [String])
     subSubCategories: string[];
}

@ObjectType()
export class CategoriesDataTypeScaler {
     @Field(() => String)
     category: string;

     @Field(() => [subCategoriesScaler])
     subcategories: subCategoriesScaler[];
}

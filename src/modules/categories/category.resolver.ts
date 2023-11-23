import { Query, Resolver } from "@nestjs/graphql";
import { CategoriesDataType, addPrefixToDuplicates, categories } from "./categories.data";
import { CategoriesDataTypeScaler } from "./dto/categories.dto";

@Resolver()
export class CategoryResolver {
     @Query(() => [CategoriesDataTypeScaler])
     async getCategories(): Promise<CategoriesDataType[]> {
          return addPrefixToDuplicates(categories);
     }
}

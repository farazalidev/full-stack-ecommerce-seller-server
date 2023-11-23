import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { ProductEntity } from './modules/product/entities/product.entity';

@Resolver()
export class AppResolver {
  @Query(() => ProductEntity)
  index() {
    return 'This is indexing query';
  }
}

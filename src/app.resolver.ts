import { Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  index() {
    return 'This is indexing query';
  }
}

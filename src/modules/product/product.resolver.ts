import { Args, Context, GqlExecutionContext, Mutation, Resolver } from "@nestjs/graphql";
import { ProductEntity } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { Query } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import ProductGuard from "./product.guard";
import { addNewProductInput } from "./dto/addNewProduct.input";
import { SellerEntity } from "../seller/entities/seller.entity";
import { GraphQLError } from "graphql";
import { storeInfoResponse } from "src/types/scalerReponses";
import { UUID } from "crypto";

@Resolver()
export class ProductResolver {
     constructor(private readonly productService: ProductService) {}

     //add a new product
     @Mutation(() => Boolean)
     @UseGuards(ProductGuard)
     async addNewProduct(
          @Context() ctx: GqlExecutionContext,
          @Args("product") product: addNewProductInput,
     ): Promise<boolean> {
          const seller: SellerEntity = (ctx as any)?.seller;
          const result = await this.productService.addNewProductService(seller, product, seller.selected_store);
          if (!result) {
               throw new GraphQLError("Error while Adding a new Product");
          }
          return true;
     }

     //get products of seller store
     @Query(() => [ProductEntity])
     @UseGuards(ProductGuard)
     async getProductsOfSellerStore(@Context() ctx: GqlExecutionContext): Promise<ProductEntity[]> {
          const seller: SellerEntity = (ctx as any)?.seller;
          const response = await this.productService.getProductsOfSellerStore(seller.selected_store, seller);
          if (!response.success) {
               throw new GraphQLError(response.error.message);
          }

          return response.data;
     }

     //get stores of seller
     @Query(() => storeInfoResponse)
     @UseGuards(ProductGuard)
     async getStoresOfSeller(@Context() ctx: GqlExecutionContext): Promise<storeInfoResponse> {
          const seller: SellerEntity = (ctx as any)?.seller;

          const response = await this.productService.getAllStoresOfSeller(seller.seller_id);

          const selectedSore = await this.productService.getSelectedStore(seller.seller_id);

          if (!response.success || !selectedSore.success) {
               throw new GraphQLError(response.error.message || selectedSore.error.message);
          }

          console.log({ store: response.data, selectedStore: selectedSore.data });

          return { stores: response.data, selectedStore: selectedSore.data };
     }

     //get product by id
     @Query(() => ProductEntity)
     @UseGuards(ProductGuard)
     async getProductById(
          @Context() ctx: GqlExecutionContext,
          @Args("product_id") product_id: UUID,
     ): Promise<ProductEntity> {
          const seller: SellerEntity = (ctx as any)?.seller;
          console.log("🚀 ~ file: product.resolver.ts:64 ~ ProductResolver ~ getProductById ~ seller:", seller);
          const response = await this.productService.getProductById(product_id, seller.seller_id);

          if (!response.success) {
               throw new GraphQLError(response.error.message);
          }
          return response.data;
     }

     @Mutation(() => Boolean)
     @UseGuards(ProductGuard)
     async updateProduct(
          @Context() ctx: GqlExecutionContext,
          @Args("product_id") product_id: string,
          @Args("updated_product") product: addNewProductInput,
     ): Promise<boolean> {
          const seller: SellerEntity = (ctx as any)?.seller;

          const response = await this.productService.updateProduct(product_id, seller.seller_id, product);

          if (!response.success) {
               throw new GraphQLError(response.error.message);
          }
          return response.data;
     }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "./entities/product.entity";
import { Seller_storeEntity } from "../seller/entities/sellerStore.entity";
import { SellerEntity } from "../seller/entities/seller.entity";
import { CustomError } from "src/utils/ErrorInterface";
import { addNewProductInput } from "./dto/addNewProduct.input";

@Injectable()
export class ProductService {
     constructor(
          @InjectRepository(ProductEntity)
          private ProductRepo: Repository<ProductEntity>,
          @InjectRepository(Seller_storeEntity)
          private Seller_store_Repo: Repository<Seller_storeEntity>,
          @InjectRepository(SellerEntity)
          private Seller_repo: Repository<SellerEntity>,
     ) {}

     //add new product service
     async addNewProductService(seller: SellerEntity, product: addNewProductInput, store_id: string): Promise<boolean> {
          try {
               const store = await this.Seller_store_Repo.findOne({
                    where: { store_id, seller: { seller_id: seller.seller_id } },
               });

               if (!store) {
                    return false;
               }

               const newProduct = this.ProductRepo.create(product);

               newProduct.store = store;
               newProduct.seller = seller;
               store.addProduct(newProduct);

               await this.Seller_store_Repo.save(store);
               await this.ProductRepo.save(newProduct);
               return true;
          } catch (error) {
               console.log(error);

               return false;
          }
     }

     // get all products of seller
     async getAllProductsOfSeller(seller_id: string): Promise<ProductEntity[]> {
          const products = await this.ProductRepo.find({
               where: { product_id: seller_id },
          });
          return products;
     }

     //get all products of seller store
     async getProductsOfSellerStore(store_id: string, seller: SellerEntity): Promise<CustomError<ProductEntity[]>> {
          try {
               const data = await this.ProductRepo.find({
                    where: {
                         seller: {
                              seller_id: seller.seller_id,
                              store: { store_id: store_id },
                         },
                    },
                    relations: { seller: true, store: true },
               });
               console.log("🚀 ~ file: product.service.ts:76 ~ ProductService ~ data:", data);
               return { data, success: true };
          } catch (error) {
               console.log(error);
               return {
                    data: undefined,
                    success: false,
                    error: { message: "Error While Getting Products", statusCode: 500 },
               };
          }
     }

     //get all stores of seller
     async getAllStoresOfSeller(seller_id: string): Promise<CustomError<Seller_storeEntity[]>> {
          try {
               const foundedStores = await this.Seller_store_Repo.find({
                    where: { seller: { seller_id } },
               });
               return { data: foundedStores, success: true };
          } catch (error) {
               console.log("🚀 ~ file: product.service.ts:116 ~ ProductService ~ error:", error);
               return {
                    data: undefined,
                    success: false,
                    error: { message: "Stores not found", statusCode: 500 },
               };
          }
     }

     //get selected store of seller
     async getSelectedStore(seller_id: string): Promise<CustomError<Seller_storeEntity>> {
          try {
               const store = await this.Seller_repo.findOne({ where: { seller_id } });

               const foundedStore = await this.Seller_store_Repo.findOne({
                    where: { store_id: store.selected_store },
               });

               return { data: foundedStore, success: true };
          } catch (error) {
               return {
                    data: undefined,
                    success: false,
                    error: { message: "Error While Fetching Store", statusCode: 500 },
               };
          }
     }

     async getProductById(productId: string, seller_id: string): Promise<CustomError<ProductEntity>> {
          try {
               const product = await this.ProductRepo.findOne({
                    where: { product_id: productId, seller: { seller_id } },
               });
               return { data: product, success: true };
          } catch (error) {
               return {
                    data: undefined,
                    error: { message: "Product not Found", statusCode: 404 },
                    success: false,
               };
          }
     }

     //update product
     async updateProduct(
          product_id: string,
          seller_id: string,
          product: addNewProductInput,
     ): Promise<CustomError<boolean>> {
          try {
               const foundedProduct = await this.ProductRepo.findOne({ where: { product_id, seller: { seller_id } } });

               await this.ProductRepo.save({
                    ...foundedProduct,
                    ...product,
               });

               return { data: true, success: true };
          } catch (error) {
               return {
                    data: undefined,
                    success: false,
                    error: { message: "Internal server error", statusCode: 500 },
               };
          }
     }
}

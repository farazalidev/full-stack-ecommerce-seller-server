import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { AppResolver } from "./app.resolver";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UploadModule } from "./modules/upload/upload.module";
import { CategoryModule } from "./modules/categories/category.moudle";
import { ProductModule } from "./modules/product/product.module";
import { AuthModule } from "./modules/seller/seller.module";

@Module({
     imports: [
          ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
          TypeOrmModule.forRoot({
               type: "postgres",
               username: process.env.DB_USER_NAME,
               password: process.env.DB_PASSWORD,
               database: process.env.DATA_BASE_NAME,
               synchronize: true,
               logging: true,
               autoLoadEntities: true,
          }),
          GraphQLModule.forRoot<ApolloDriverConfig>({
               driver: ApolloDriver,
               autoSchemaFile: join(process.cwd(), "/src/graphql/schema.graphql"),
               playground: true,
               sortSchema: true,
               context: ({ req, res }: { req: Request; res: Response }) => ({
                    req,
                    res,
               }),
          }),
          AuthModule,
          UploadModule,
          ProductModule,
          CategoryModule,
     ],
     controllers: [],
     providers: [AppResolver, AppService],
})
export class AppModule {}

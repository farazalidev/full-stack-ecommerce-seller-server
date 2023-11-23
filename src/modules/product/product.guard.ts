import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { decryptAccessToken, genAccessToken } from "src/utils/genAuthTokens";
import { SellerEntity } from "../seller/entities/seller.entity";
import { Repository } from "typeorm";
import { Request, Response } from "express";
import { decryptRefreshToken } from "../../utils/genAuthTokens";
import { GraphQLError } from "graphql";

@Injectable()
export default class ProductGuard implements CanActivate {
     constructor(
          @InjectRepository(SellerEntity)
          private seller_repo: Repository<SellerEntity>,
     ) {}

     async canActivate(context: ExecutionContext): Promise<boolean> {
          const ctx = GqlExecutionContext.create(context);

          const req: Request = ctx.getArgByIndex(2).req;
          const res: Response = ctx.getArgByIndex(2).res;

          const accessToken = req.cookies[process.env.ACCESS_TOKEN_SECRET_NAME];
          const refreshToken = req.cookies[process.env.REFRESH_TOKEN_SECRET_NAME];

          if (!refreshToken) {
               throw new GraphQLError("UnAuthorized");
          }

          //if the access token is not expired then sending seller through access token
          const accessTokenDecrypted = decryptAccessToken(decodeURIComponent(accessToken));

          if (accessTokenDecrypted.success) {
               const accessTokenSeller = await this.seller_repo.findOne({
                    where: { seller_id: accessTokenDecrypted.data.seller_meta?.seller_id },
               });
               ctx.getContext().seller = accessTokenSeller;
          }

          if (!accessToken || !accessTokenDecrypted.data.seller_meta.seller_id) {
               //getting seller from refresh token if the access token is expired
               const dRefreshToken = decryptRefreshToken(refreshToken);
               const foundedSeller = await this.seller_repo.findOne({
                    where: { seller_id: dRefreshToken.data.seller_meta?.seller_id },
               });
               ctx.getContext().seller = foundedSeller;

               //generating a new access token
               const newAccessToken = genAccessToken(foundedSeller);

               res.cookie(process.env.ACCESS_TOKEN_SECRET_NAME, newAccessToken);
               return true;
          }
          return true;
     }
}

import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { decryptAccessToken } from "src/utils/genAuthTokens";

@Injectable()
export class authGuard implements CanActivate {
     async canActivate(context: ExecutionContext): Promise<boolean> {
          const req = context.switchToHttp().getRequest();

          const accessToken = req.headers.authorization;

          if (!accessToken) {
               throw new HttpException("UnAuthorized", 401);
          }

          //if the access token is not expired then sending seller through access token
          const accessTokenDecrypted = decryptAccessToken(decodeURIComponent(accessToken));

          if (accessTokenDecrypted.success) {
               req.seller = await accessTokenDecrypted.data.seller_meta.seller_id;
               console.log(accessTokenDecrypted.data.seller_meta);

               return true;
          }

          console.log("end");

          return false;
     }
}

import { JwtPayload, sign, verify } from "jsonwebtoken";
import { SellerEntity } from "src/modules/seller/entities/seller.entity";
import { decrypt, encrypt } from "./encrypt-decrypt";

export const genAccessToken = (seller: SellerEntity): string => {
     const token = sign(
          {
               seller_meta: { email: seller.seller_email, seller_id: seller.seller_id },
          },
          process.env.ACCESS_TOKEN_SECRET,
     );

     const encryptedToken = encrypt(token, process.env.ACCESS_TOKEN_ENCRYPTION_KEY);
     return encryptedToken;
};

export const genRefreshToken = (seller: SellerEntity): string => {
     const token = sign(
          {
               seller_meta: { email: seller.seller_email, seller_id: seller.seller_id },
          },
          process.env.REFRESH_TOKEN_SECRET,
     );

     const encryptedToken = encrypt(token, process.env.REFRESH_TOKEN_ENCRYPTION_KEY);
     return encryptedToken;
};

export const decryptAccessToken = (
     encryptedToken: string,
): {
     success: boolean;
     data?: JwtPayload | { seller_meta: { seller_email: string; seller_id: string } };
} => {
     try {
          const decryptedToken = decrypt(encryptedToken, process.env.ACCESS_TOKEN_ENCRYPTION_KEY);

          const data = verify(decryptedToken.data, process.env.ACCESS_TOKEN_SECRET) as {
               seller_meta: { seller_email: string; seller_id: string };
          };

          return { success: true, data };
     } catch (error) {
          console.log("🚀 ~ file: genAuthTokens.ts:56 ~ error:", error);
          return {
               data: undefined,
               success: false,
          };
     }
};

export const decryptRefreshToken = (
     encryptedToken: string,
): {
     success: boolean;
     data?: JwtPayload | { seller_meta: { seller_email: string; seller_id: string } };
} => {
     try {
          const decryptedToken = decrypt(encryptedToken, process.env.REFRESH_TOKEN_ENCRYPTION_KEY);

          const data = verify(decryptedToken.data, process.env.REFRESH_TOKEN_SECRET) as {
               seller_meta: { seller_email: string; seller_id: string };
          };
          return { success: true, data };
     } catch (error) {
          console.log("🚀 ~ file: genAuthTokens.ts:81 ~ error:", error);
          return { success: false, data: undefined };
     }
};

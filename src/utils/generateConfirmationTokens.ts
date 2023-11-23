import { SellerDto } from "src/modules/seller/dto/seller.dto";
import * as jwt from "jsonwebtoken";
import { decrypt, encrypt } from "./encrypt-decrypt";
import { JwtPayload } from "jsonwebtoken";

export const genRegToken = (seller: SellerDto): string => {
     const token = jwt.sign({ email: seller.seller_email }, process.env.REGISTRATION_TOKEN_SECRET, {
          expiresIn: process.env.REGISTRATION_TOKEN_EXPIRATION,
     });
     return encrypt(token, process.env.CONFIRMATION_REGISTRATION_KEY);
};

export const decodeRegToken = (encryptedToken: string): string | JwtPayload => {
     try {
          const decryptedToken = decrypt(encryptedToken, process.env.CONFIRMATION_REGISTRATION_KEY);
          const decodedToken = jwt.verify(decryptedToken.data, process.env.REGISTRATION_TOKEN_SECRET);

          return decodedToken;
     } catch (error) {
          return "Expired";
     }
};

export const genLoginToken = (seller: SellerDto): string => {
     const token = jwt.sign({ email: seller.seller_email }, process.env.LOGIN_TOKEN_SECRET, {
          expiresIn: process.env.LOGIN_TOKEN_EXPIRATION,
     });
     return encrypt(token, process.env.CONFIRMATION_LOGIN_KEY);
};

export const decodeLoginToken = (encryptedToken: string): string | JwtPayload => {
     try {
          const decryptedToken = decrypt(encryptedToken, process.env.CONFIRMATION_LOGIN_KEY);
          const decodedToken = jwt.verify(decryptedToken.data, process.env.LOGIN_TOKEN_SECRET);

          return decodedToken;
     } catch (error) {
          return "Expired";
     }
};

import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { SellerEntity } from 'src/modules/auth/entities/seller.entity.';
import { decrypt, encrypt } from './encrypt-decrypt';

export const genAccessToken = (seller: SellerEntity): string => {
  const token = sign(
    { email: seller.seller_email },
    process.env.ACCESS_TOKEN_SECRET,
  );

  const encryptedToken = encrypt(
    token,
    process.env.ACCESS_TOKEN_ENCRYPTION_KEY,
  );
  return encryptedToken;
};

export const genRefreshToken = (seller: SellerEntity): string => {
  const token = sign(
    { email: seller.seller_email },
    process.env.REFRESH_TOKEN_SECRET,
  );

  const encryptedToken = encrypt(
    token,
    process.env.REFRESH_TOKEN_ENCRYPTION_KEY,
  );
  return encryptedToken;
};

export const decodeAccessToken = (
  encryptedToken: string,
): string | JwtPayload => {
  const decryptedToken = decrypt(
    encryptedToken,
    process.env.ACCESS_TOKEN_ENCRYPTION_KEY,
  );
  return verify(decryptedToken, process.env.ACCESS_TOKEN_SECRET);
};

export const decodeRefreshToken = (
  encryptedToken: string,
): string | JwtPayload => {
  const decryptedToken = decrypt(
    encryptedToken,
    process.env.REFRESH_TOKEN_ENCRYPTION_KEY,
  );
  return verify(decryptedToken, process.env.REFRESH_TOKEN_SECRET);
};

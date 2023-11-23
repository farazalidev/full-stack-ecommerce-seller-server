import { SellerDto } from "src/modules/seller/dto/seller.dto";
import { sendEmail } from "./sendEmail";
import { genLoginToken } from "./generateConfirmationTokens";

export const sendLoginConfirmation = async (seller: SellerDto): Promise<boolean> => {
     const loginToken = genLoginToken(seller);
     try {
          await sendEmail(
               seller.seller_email,
               `${process.env.FRONT_END_URL}/auth/confirmlogin?token=${encodeURIComponent(loginToken)}`,
          );
          return true;
     } catch (error) {
          return false;
     }
};

import { SellerDto } from 'src/modules/auth/dto/seller.dto';
import { sendEmail } from './sendEmail';
import { genRegToken } from './generateConfirmationTokens';

export const sendConfirmation = async (seller: SellerDto): Promise<boolean> => {
  const regToken = genRegToken(seller);
  try {
    await sendEmail(
      seller.seller_email,
      `${process.env.FRONT_END_URL}/auth/completereg?token=${encodeURIComponent(
        regToken,
      )}`,
    );
    return true;
  } catch (error) {
    return false;
  }
};

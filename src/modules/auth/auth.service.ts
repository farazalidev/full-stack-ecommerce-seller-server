import { Injectable } from '@nestjs/common';
import { SellerDto } from './dto/seller.dto';
import { SellerEntity } from './entities/seller.entity.';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError } from 'src/utils/ErrorInterface';
import { sendConfirmation } from 'src/utils/sendConfirmation';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import { sellerAddressEntity } from './entities/sellerAddress.entity';
import { SellerInfo } from 'src/types/seller';
import { Seller_storeEntity } from './entities/sellerStore.entity';
import { LoginDto } from './dto/sellerLogin.dto';
import { sendLoginConfirmation } from 'src/utils/sendLoginEmail';
import { decodeLoginToken } from '../../utils/generateConfirmationTokens';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SellerEntity)
    private sellerRepo: Repository<SellerEntity>,
    @InjectRepository(sellerAddressEntity)
    private sellerAddressRepo: Repository<sellerAddressEntity>,
    @InjectRepository(Seller_storeEntity)
    private sellerStoreRepo: Repository<Seller_storeEntity>,
  ) {}

  //register seller
  async RegisterSeller(seller: SellerDto): Promise<CustomError<SellerEntity>> {
    try {
      const isSellerRegistered = await this.sellerRepo.findOne({
        where: { seller_email: seller.seller_email },
      });

      if (isSellerRegistered) {
        throw new Error(
          `This email '${isSellerRegistered.seller_email}' is already Registered`,
        );
      }

      const isConfirmationSended = await sendConfirmation(seller);

      if (!isConfirmationSended) {
        throw new Error('Internal server Error, please try later');
      }

      //hashing password
      const hashedPassword = await bcrypt.hash(seller.seller_password, 10);

      const newSeller = this.sellerRepo.create({
        ...seller,
        seller_password: hashedPassword,
      });
      const savedSeller = await this.sellerRepo.save(newSeller);
      return { data: savedSeller, success: true };
    } catch (error) {
      return {
        data: undefined,
        error: { message: error.message, statusCode: 500 },
        success: false,
      };
    }
  }

  //Resend confirmation email
  async ResendRegistrationEmail(
    decodedToken: string | JwtPayload,
  ): Promise<CustomError<SellerEntity>> {
    try {
      if (!(decodedToken as any)?.email) {
        return {
          data: undefined,
          success: false,
          error: { message: 'Invalid link Provided', statusCode: 400 },
        };
      }

      const foundedAccount = await this.sellerRepo.findOne({
        where: { seller_email: (decodedToken as any)?.email },
      });

      if (!foundedAccount) {
        throw new Error('Account not founded');
      }

      // sending email
      const isConfirmationSended = await sendConfirmation(foundedAccount);
      if (!isConfirmationSended) {
        throw new Error('Failed to send Email, Try again');
      }
      return {
        data: foundedAccount,
        success: true,
      };
    } catch (error) {
      return {
        data: undefined,
        success: false,
        error: { message: error.message, statusCode: 404 },
      };
    }
  }

  //completer registration
  async complRegService(
    seller_email: string,
    seller_info: SellerInfo,
  ): Promise<CustomError<any>> {
    const foundedSeller = await this.sellerRepo.findOne({
      where: { seller_email: (seller_email as any)?.email },
    });

    if (!foundedSeller) {
      return {
        data: undefined,
        success: false,
        error: {
          message:
            'Your Registration was not successful, please try to register Again.',
          statusCode: 400,
        },
      };
    }

    if (foundedSeller.isConfirmed) {
      return {
        data: undefined,
        success: false,
        error: {
          message: 'Your account Registration Already completed',
          statusCode: 400,
        },
      };
    }

    if (foundedSeller.seller_address && foundedSeller.store) {
      return {
        data: foundedSeller,
        success: true,
      };
    }

    const newSellerAddress = this.sellerAddressRepo.create({
      city: seller_info.city,
      country: seller_info.country,
      home_address: seller_info.home_address,
      state: seller_info.state,
      postal_code: seller_info.postal_code,
      street_address: seller_info.street_address,
    });

    const newStore = this.sellerStoreRepo.create({
      store_category: seller_info.store_category,
      store_phone: seller_info.phone,
      store_location: seller_info.store_location,
      store_name: seller_info.store_name,
    });

    foundedSeller.seller_address = newSellerAddress;
    foundedSeller.store = newStore;
    foundedSeller.isConfirmed = true;
    const savedSeller = await this.sellerRepo.save(foundedSeller);

    return {
      data: savedSeller,
      success: true,
    };
  }

  async LoginService(Login_info: LoginDto): Promise<CustomError<SellerEntity>> {
    const existedAccount = await this.sellerRepo.findOne({
      where: { seller_email: Login_info.seller_email },
    });

    if (!existedAccount) {
      return {
        data: undefined,
        success: false,
        error: { message: 'Invalid Email or Password', statusCode: 400 },
      };
    }

    const isValidPassword = await bcrypt.compare(
      Login_info.seller_password,
      existedAccount.seller_password,
    );

    if (!isValidPassword) {
      return {
        data: undefined,
        success: false,
        error: { message: 'Invalid Email or Password', statusCode: 400 },
      };
    }

    const isConfirmationSended = await sendLoginConfirmation(existedAccount);

    if (!isConfirmationSended) {
      return {
        data: undefined,
        success: false,
        error: { message: 'Login Failed', statusCode: 500 },
      };
    }

    return {
      data: existedAccount,
      success: true,
    };
  }

  //Resend confirmation email for login
  async ResendLoginEmail(
    decodedToken: string | JwtPayload,
  ): Promise<CustomError<SellerEntity>> {
    try {
      if (!(decodedToken as any)?.email) {
        return {
          data: undefined,
          success: false,
          error: { message: 'Invalid link Provided', statusCode: 400 },
        };
      }

      const foundedAccount = await this.sellerRepo.findOne({
        where: { seller_email: (decodedToken as any)?.email },
      });

      if (!foundedAccount) {
        throw new Error('Account not founded');
      }

      // sending email
      const isConfirmationSended = await sendLoginConfirmation(foundedAccount);
      if (!isConfirmationSended) {
        throw new Error('Failed to send Email, Try again');
      }
      return {
        data: foundedAccount,
        success: true,
      };
    } catch (error) {
      return {
        data: undefined,
        success: false,
        error: { message: error.message, statusCode: 404 },
      };
    }
  }

  //verify login
  async verifyLoginService(token: string): Promise<CustomError<SellerEntity>> {
    const decodedToken = decodeLoginToken(token);

    if (decodedToken === 'Expired') {
      return {
        data: undefined,
        success: false,
        error: { message: 'Link Expired', statusCode: 400 },
      };
    }

    const foundedAccount = await this.sellerRepo.findOne({
      where: { seller_email: (decodedToken as any)?.email },
    });

    if (!foundedAccount) {
      return {
        data: undefined,
        success: false,
        error: { message: 'Account not Found', statusCode: 404 },
      };
    }

    return {
      data: foundedAccount,
      success: true,
    };
  }
}

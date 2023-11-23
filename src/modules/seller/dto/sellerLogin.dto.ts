import { IsAlphanumeric, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  seller_email: string;

  @IsAlphanumeric()
  seller_password: string;
}

import { Length } from 'class-validator';

export class SellerDto {
  @Length(6, 65, {
    message: 'Name must be longer than or equal to 6 characters',
  })
  seller_name: string;

  @Length(6, 355, {
    message: 'Email must be longer than or equal to 6 characters',
  })
  seller_email: string;

  @Length(6, 200, { message: 'Password is required' })
  seller_password: string;
}

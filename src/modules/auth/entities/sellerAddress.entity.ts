import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity({ name: 'seller_address' })
export class sellerAddressEntity {
  @PrimaryColumn({ type: 'uuid' })
  address_id: string = v4();

  @Column({ type: 'varchar' })
  street_address: string;

  @Column({ type: 'varchar' })
  home_address: string;

  @Column({ type: 'varchar' })
  city: string;

  @Column({ type: 'varchar' })
  country: string;

  @Column({ type: 'varchar' })
  state: string;

  @Column({ type: 'varchar' })
  postal_code: string;
}

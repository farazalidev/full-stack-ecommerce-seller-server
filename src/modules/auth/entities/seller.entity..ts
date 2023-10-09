import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { sellerAddressEntity } from './sellerAddress.entity';
import { Seller_storeEntity } from './sellerStore.entity';

@Entity({ name: 'seller' })
export class SellerEntity {
  @PrimaryColumn({ type: 'uuid' })
  seller_id: string = v4();

  @Column({ type: 'varchar' })
  seller_name: string;

  @Column({ type: 'varchar' })
  seller_email: string;

  @Column({ type: 'varchar' })
  seller_password: string;

  @Column({ type: 'date' })
  seller_join_date?: Date = new Date();

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean = false;

  @OneToOne(() => sellerAddressEntity, { cascade: true })
  @JoinColumn({ name: 'seller_address' })
  seller_address: sellerAddressEntity;

  @OneToOne(() => Seller_storeEntity, {
    cascade: true,
  })
  @JoinColumn({ name: 'store' })
  store: Seller_storeEntity;
}

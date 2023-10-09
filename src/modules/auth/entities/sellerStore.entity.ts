import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@Entity({ name: 'store' })
export class Seller_storeEntity {
  @PrimaryColumn({ type: 'uuid' })
  store_id: string = v4();

  @Column({ type: 'varchar' })
  store_name: string;

  @Column({ type: 'varchar' })
  store_location: string;

  @Column({ type: 'varchar' })
  store_category: string;

  @Column({ type: 'varchar' })
  store_phone: number;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';

@ObjectType()
@Entity({ name: 'seller_address' })
export class sellerAddressEntity {
  @Field()
  @PrimaryColumn({ type: 'uuid' })
  address_id: string = v4();

  @Field()
  @Column({ type: 'varchar' })
  street_address: string;

  @Field()
  @Column({ type: 'varchar' })
  home_address: string;

  @Field()
  @Column({ type: 'varchar' })
  city: string;

  @Field()
  @Column({ type: 'varchar' })
  country: string;

  @Field()
  @Column({ type: 'varchar' })
  state: string;

  @Field()
  @Column({ type: 'varchar' })
  postal_code: string;
}

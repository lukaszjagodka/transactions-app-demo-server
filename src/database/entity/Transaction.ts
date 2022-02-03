import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Transaction {
  @PrimaryColumn({type: 'bigint'})
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  amountFirstPair: number;

  @Column()
  currencyFirstPair: string;

  @Column({type: 'float'})
  rate: number;

  @Column({type: 'float'})
  amountSecondPair: number;

  @Column()
  currencySecondPair: string;

  @ManyToOne(type => Account, account => account.transactions)
  account: Account;

  @CreateDateColumn()
  createdAt: Date;
}

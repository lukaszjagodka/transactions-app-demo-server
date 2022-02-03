import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'bigint'})
  accountNumber: number;

  @Column()
  accountValue: number;
  
  @Column()
  currency: string;

  @OneToMany(type => Transaction, transaction => transaction.account)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;
}

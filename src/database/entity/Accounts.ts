import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;
}

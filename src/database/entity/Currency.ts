import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from 'typeorm';

@Entity()
export class Currency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    currencyString: string;

    @CreateDateColumn()
    createdAt: Date;
}
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Currency {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    currencyString: string;

    @Column()
    createdAt: Date;
}
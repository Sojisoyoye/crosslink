import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "../users/users.entity";

@Entity()
export class Offer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  type!: "buy" | "sell";

  @Column()
  currency!: string;

  @Column("decimal", { precision: 20, scale: 8 }) // High precision for financial data
  amount!: number;

  @Column("decimal", { precision: 20, scale: 8 }) // High precision for exchange rates
  rate!: number;

  @Column({ default: "pending" })
  status!: "pending" | "completed" | "cancelled";

  @ManyToOne(() => User, (user) => user.offers)
  user!: User;

  @Column()
  userId!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;
}

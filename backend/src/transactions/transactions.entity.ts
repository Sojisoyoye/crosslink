import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from "typeorm";
import { User } from "../users/users.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index()
  senderId!: string;

  @Column()
  @Index()
  receiverId!: string;

  @Column("decimal", { precision: 20, scale: 8 }) // High precision for financial data
  amount!: number;

  @Column()
  currency!: string;

  @Column({ default: "pending" })
  status!: "pending" | "completed" | "failed";

  @ManyToOne(() => User, (user) => user.transactions)
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

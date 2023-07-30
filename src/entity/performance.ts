import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user";
import { Reserve } from "./reserve";

@Entity("Performances")
export class Performance {
  @PrimaryGeneratedColumn()
  performance_id!: number;

  @Column({ type: "varchar", nullable: false })
  title!: string;

  @Column({ type: "varchar", nullable: false })
  content!: string;

  @Column({ type: "bigint", nullable: false })
  price!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.performanceId)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Reserve, (reserve) => reserve.reserve_id)
  reserveId!: Reserve[];
}

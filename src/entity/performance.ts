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

  @Column({ type: "varchar", nullable: false })
  date!: string;

  @Column({ type: "varchar", nullable: false })
  place!: string;

  @Column({ type: "int", nullable: false })
  seatCount!: number;

  @Column({ type: "varchar", nullable: false })
  image!: string;

  @Column({ type: "varchar", nullable: false })
  category!: string;

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

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Performance } from "./performance";
import { UserInfo } from "./userInfo";

@Entity("Reserves")
export class Reserve {
  @PrimaryGeneratedColumn()
  reserve_id!: number;

  @Column({ type: "bigint", nullable: true })
  seat!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @ManyToOne(() => Performance, (performance) => performance.reserveId)
  @JoinColumn({ name: "performance_id" })
  performance!: Performance;

  @ManyToOne(() => UserInfo, (userInfo) => userInfo.reserveId)
  @JoinColumn({ name: "user_info_id" })
  userInfo!: UserInfo;
}

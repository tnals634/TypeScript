import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "./user";
import { Point } from "./point";
import { Reserve } from "./reserve";

@Entity("UserInfos")
export class UserInfo {
  @PrimaryGeneratedColumn()
  user_info_id!: number;

  @Column({ type: "varchar", nullable: false })
  name!: string;

  @Column({ type: "varchar", nullable: false })
  phone!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @OneToMany(() => Point, (point) => point.point_id)
  pointId!: Point[];

  @OneToMany(() => Reserve, (reserve) => reserve.reserve_id)
  reserveId!: Reserve[];
}

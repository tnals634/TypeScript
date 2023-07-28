import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity("Points")
export class Point extends BaseEntity {
  @PrimaryGeneratedColumn()
  point_id!: number;

  @Column({ type: "bigint", nullable: false })
  user_info_id!: number;

  @Column({ type: "tinyint", nullable: false })
  point_status!: number;

  @Column({ type: "bigint", nullable: false })
  point!: number;

  @Column({ type: "varchar", nullable: false })
  point_reason!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

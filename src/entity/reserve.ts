import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity("Reserves")
export class Reserve extends BaseEntity {
  @PrimaryGeneratedColumn()
  reserve_id!: number;

  @Column({ type: "bigint", nullable: false })
  user_id!: number;

  @Column({ type: "bigint", nullable: false })
  performance_id!: number;

  @Column({ type: "bigint", nullable: true })
  seat!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

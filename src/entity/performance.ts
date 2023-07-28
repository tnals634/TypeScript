import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@Entity("Performances")
export class Performance extends BaseEntity {
  @PrimaryGeneratedColumn()
  performance_id!: number;

  @Column({ type: "bigint", nullable: false })
  user_id!: number;

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
}

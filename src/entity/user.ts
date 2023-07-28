import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("Users")
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ type: "varchar", nullable: false })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  password!: string;

  @Column({ type: "tinyint", nullable: false })
  group!: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

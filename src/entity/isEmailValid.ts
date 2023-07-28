import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("IsEmailValid")
export class IsEmailValid {
  @PrimaryGeneratedColumn()
  email_auth_id!: number;

  @Column({ type: "varchar", nullable: false })
  email!: string;

  @Column({ type: "varchar", nullable: false })
  auth_code!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

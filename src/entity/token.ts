import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity("Tokens")
export class Token {
  @PrimaryGeneratedColumn()
  token_id!: number;

  @Column({ type: "varchar", nullable: false })
  refreshToken!: string;

  @Column({ type: "bigint", nullable: false })
  user_id!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

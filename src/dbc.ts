import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();
export const myDataBase = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_AWS_HOST,
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: ["src/entity/*.ts"],
  // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  // logging: true,
  // synchronize: true,
});

import express from "express";
import cookieParser from "cookie-parser";
import { myDataBase } from "./dbc";
import { userRouter, performanceRouter } from "./route";

// db 연결
myDataBase
  .initialize()
  .then(() => {
    console.log("DataBase has been initialized!");
  })
  .catch((err) => {
    console.error("Error during DataBase initialization:", err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api", [userRouter, performanceRouter]);

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});

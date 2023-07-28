import express from "express";
import { Request, Response } from "express";
import { myDataBase } from "./dbc";
import userRouter from "./route/user.route";

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

app.use("/api", userRouter);

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});

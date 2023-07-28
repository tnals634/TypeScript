import express from "express";
import { Request, Response } from "express";
import { myDataBase } from "./dbc";

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

app.listen(3000, () => {
  console.log("Express server has started on port 3000");
});

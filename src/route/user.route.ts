import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.findUser);
router.post("/emailValid", UserController.isEmailValid);
export default router;

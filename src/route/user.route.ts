import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.login);
router.post("/emailValid", UserController.isEmailValid);
// router.get("/profile",UserController.findUser);
export default router;

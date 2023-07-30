import express from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/middleware";

const router = express.Router();

router.post("/signup", UserController.createUser);
router.post("/login", UserController.login);
router.post("/emailValid", UserController.isEmailValid);
router.get(
  "/profile",
  authMiddleware.allAuthMiddleware,
  UserController.findUser
);
router.get("/logout", authMiddleware.allAuthMiddleware, UserController.logout);
export default router;

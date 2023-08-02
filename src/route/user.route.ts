import express from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/middleware";
import { userValidation } from "../middleware/validation";

const router = express.Router();

router.post(
  "/signup",
  userValidation.signupValidation,
  UserController.createUser
);
router.post("/login", userValidation.loginValidation, UserController.login);
router.post(
  "/emailValid",
  userValidation.emailValidation,
  UserController.isEmailValid
);
router.get(
  "/profile",
  authMiddleware.allAuthMiddleware,
  UserController.findUser
);
router.get("/logout", authMiddleware.allAuthMiddleware, UserController.logout);
export default router;

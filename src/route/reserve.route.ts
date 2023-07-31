import express from "express";
import { ReserveController } from "../controllers/reserve.controller";
import { authMiddleware } from "../middleware/middleware";

const router = express.Router();

router.get(
  "/reserve",
  authMiddleware.allAuthMiddleware,
  ReserveController.getReserve
);
router.post(
  "/reserve/:performance_id",
  authMiddleware.allAuthMiddleware,
  ReserveController.createReserve
);

export default router;

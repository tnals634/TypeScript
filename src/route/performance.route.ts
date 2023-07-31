import express from "express";
import { PerformanceController } from "../controllers/performance.controller";
import { authMiddleware } from "../middleware/middleware";

const router = express.Router();
router.post(
  "/performance",
  authMiddleware.allAuthMiddleware,
  PerformanceController.performanceCreate
);
router.get("/performance", PerformanceController.performanceGet);
router.get("/performanceTitle", PerformanceController.performanceTitleGet);
router.get(
  "/performance/:performance_id",
  PerformanceController.performanceDetailGet
);
router.post("/performance/search", PerformanceController.performanceSearchGet);
export default router;

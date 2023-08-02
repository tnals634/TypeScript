import express from "express";
import { PerformanceController } from "../controllers/performance.controller";
import { authMiddleware } from "../middleware/middleware";
import upload from "../middleware/imageUpload";
import { performanceValidation } from "../middleware/validation";

const router = express.Router();
router.post(
  "/performance",
  authMiddleware.allAuthMiddleware,
  upload.single("image"),
  performanceValidation.pValidation,
  PerformanceController.performanceCreate
);
router.get("/performance", PerformanceController.performanceGet);
router.get("/performanceTitle", PerformanceController.performanceTitleGet);
router.get(
  "/performance/:performance_id",
  PerformanceController.performanceDetailGet
);
router.post(
  "/performance/search",
  performanceValidation.searchValidation,
  PerformanceController.performanceSearchGet
);
export default router;

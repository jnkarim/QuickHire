import { Router } from "express";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Requires login to apply
router.post("/", protect, submitApplication);

// Admin only
router.get("/", protect, adminOnly, getAllApplications);
router.get("/:id", protect, adminOnly, getApplicationById);
router.patch("/:id/status", protect, adminOnly, updateApplicationStatus);
router.delete("/:id", protect, adminOnly, deleteApplication);

export default router;

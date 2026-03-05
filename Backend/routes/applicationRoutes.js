import { Router } from "express";
import {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = Router();

// Public
router.post("/", submitApplication);

// Admin
router.get("/", getAllApplications);
router.get("/:id", getApplicationById);
router.patch("/:id/status", updateApplicationStatus);
router.delete("/:id", deleteApplication);

export default router;

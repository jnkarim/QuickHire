import { Router } from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getCategories,
  getJobApplications,
} from "../controllers/jobController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

// Public routes
router.get("/", getAllJobs);
router.get("/categories", getCategories);
router.get("/:id", getJobById);

// Admin only routes
router.post("/", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);
router.get("/:id/applications", protect, adminOnly, getJobApplications);

export default router;

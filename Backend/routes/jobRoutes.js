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

const router = Router();

// Public routes

router.get("/", getAllJobs);
router.get("/categories", getCategories); 
router.get("/:id", getJobById);


// Admin routes
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);
router.get("/:id/applications", getJobApplications);

export default router;

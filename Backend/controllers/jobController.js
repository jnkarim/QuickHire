import Job from "../models/Job.js";
import Application from "../models/Application.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../middleware/response.js";

// GET /api/jobs
export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      type,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      filter.type = type;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate("applicationCount")
        .lean(),
      Job.countDocuments(filter),
    ]);

    return paginatedResponse(res, jobs, total, pageNum, limitNum);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/jobs/:id
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("applicationCount")
      .lean();

    if (!job) {
      return errorResponse(res, "Job not found", 404);
    }

    return successResponse(res, job);
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid job ID", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

// POST /api/jobs  (Admin)
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    return successResponse(res, job, "Job created successfully", 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages, 422);
    }
    return errorResponse(res, error.message, 500);
  }
};

// PUT /api/jobs/:id  (Admin)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!job) {
      return errorResponse(res, "Job not found", 404);
    }

    return successResponse(res, job, "Job updated successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid job ID", 400);
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages, 422);
    }
    return errorResponse(res, error.message, 500);
  }
};

// DELETE /api/jobs/:id  (Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return errorResponse(res, "Job not found", 404);
    }

    await Application.deleteMany({ jobId: req.params.id });

    return successResponse(res, null, "Job deleted successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid job ID", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/jobs/categories
export const getCategories = async (_req, res) => {
  try {
    const categories = await Job.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return successResponse(res, categories);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/jobs/:id/applications  (Admin)
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) {
      return errorResponse(res, "Job not found", 404);
    }

    const applications = await Application.find({ jobId: req.params.id })
      .sort("-createdAt")
      .lean();

    return successResponse(res, applications);
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid job ID", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

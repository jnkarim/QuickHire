import Application from "../models/Application.js";
import Job from "../models/Job.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../middleware/response.js";

// POST /api/applications
export const submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, resumeLink, coverNote } = req.body;

    const job = await Job.findOne({ _id: jobId, isActive: true });
    if (!job) {
      return errorResponse(
        res,
        "Job not found or no longer accepting applications",
        404,
      );
    }

    const application = await Application.create({
      jobId,
      name,
      email,
      resumeLink,
      coverNote,
    });

    return successResponse(
      res,
      application,
      "Application submitted successfully",
      201,
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages, 422);
    }
    if (error.code === 11000) {
      return errorResponse(
        res,
        "You have already applied for this job with this email address",
        409,
      );
    }
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/applications  (Admin)
export const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, jobId } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (jobId) {
      filter.jobId = jobId;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate("jobId", "title company location")
        .sort("-createdAt")
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Application.countDocuments(filter),
    ]);

    return paginatedResponse(res, applications, total, pageNum, limitNum);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/applications/:id  (Admin)
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId", "title company location category")
      .lean();

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(res, application);
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid application ID", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

// PATCH /api/applications/:id/status  (Admin)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Reviewed", "Shortlisted", "Rejected"];

    if (!validStatuses.includes(status)) {
      return errorResponse(
        res,
        `Status must be one of: ${validStatuses.join(", ")}`,
        422,
      );
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    ).populate("jobId", "title company");

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(res, application, "Application status updated");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid application ID", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

// DELETE /api/applications/:id  (Admin)
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return errorResponse(res, "Application not found", 404);
    }

    return successResponse(res, null, "Application deleted successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, "Invalid application ID", 400);
    }
    return errorResponse(res, error.message, 500);
  }
};

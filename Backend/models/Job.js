import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    logoUrl: {
      type: String,
      trim: true,
      default: null,
    },
    location: {
      type: String,
      required: [true, "location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Junior Software Engineer",
        "Senior Software Engineer",
        "UI/UX Designer",
        "Machine Learning Engineer",
        "Human Resources",
        "DevOps Engineer",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      enum: ["Internship", "Remote", "Part Time", "Full Time"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      minlength: [50, "Description must be at least 50 characters"],
    },
  },
  { timestamps: true },
);

jobSchema.index({ title: "text", company: "text", description: "text" });
jobSchema.index({ category: 1, location: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);
export default Job;
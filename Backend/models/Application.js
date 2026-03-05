import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Job",
      required: [true, "Job id is required"],
    },

    name: {
      type: String,
      required: [true, "Application name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"], 
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (val) => validator.isEmail(val),
        message: "Please provide a valid email address",
      },
    },

    resumeLink: {
      type: String,
      required: [true, "Resume link is required"],
      trim: true,
      validate: {
        validator: (val) =>
          validator.isURL(val, {
            protocols: ["http", "https"],
            require_protocol: true,
          }),
        message: "Please provide a valid URL for your resume",
      },
    },

    coverNote: {
      type: String,
      trim: true,
      maxlength: [1000, "Cover note cannot exceed 1000 characters"],
    },

    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, email: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
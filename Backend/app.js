import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import { notFound, globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());                    
app.use(express.urlencoded({ extended: true }));  
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import { notFound, globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());                          // ← line 1
app.use(express.urlencoded({ extended: true }));  // ← line 2
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
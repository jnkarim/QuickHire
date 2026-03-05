import express from "express";
import cors from "cors";
import { notFound, globalErrorHandler } from "./middleware/errorHandler.js";

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(notFound);
app.use(globalErrorHandler);

export default app;

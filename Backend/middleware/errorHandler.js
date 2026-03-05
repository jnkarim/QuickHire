import { errorResponse } from "./response.js";

// 404 handler
export const notFound = (req, res, _next) => {
  return errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
};

// Global error handler
export const globalErrorHandler = (err, _req, res, _next) => {
  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return errorResponse(res, message, statusCode);
};

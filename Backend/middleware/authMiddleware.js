import jwt from "jsonwebtoken";
import { errorResponse } from "./response.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "You must be logged in to access this", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(
      res,
      "Invalid or expired token. Please log in again.",
      401,
    );
  }
};

// Admin only
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return errorResponse(res, "Access denied. Admins only.", 403);
  }
  next();
};

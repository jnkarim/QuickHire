import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { successResponse, errorResponse } from "../middleware/response.js";

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "Email already registered", 409);
    }

    const user = await User.create({ name, email, password, role: "user" });
    const token = signToken(user._id, user.role);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Registration successful",
      201,
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, messages, 422);
    }
    return errorResponse(res, error.message, 500);
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    const token = signToken(user._id, user.role);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// POST /api/auth/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, "Email and password are required", 400);
    }

    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return errorResponse(res, "Invalid admin credentials", 401);
    }

    const token = jwt.sign(
      { id: "admin", role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return successResponse(
      res,
      { token, user: { id: "admin", name: "Admin", email, role: "admin" } },
      "Admin login successful",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, "User not found", 404);
    return successResponse(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// GET /api/auth/google/callback
export const googleCallback = (req, res) => {
  try {
    const user = req.user;
    const token = signToken(user._id, user.role);

    
    const frontendURL =
      process.env.FRONTEND_CLIENT_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/auth/callback?token=${token}`);
  } catch (error) {
    const frontendURL =
      process.env.FRONTEND_CLIENT_URL || "http://localhost:5173";
    res.redirect(`${frontendURL}/login?error=google_failed`);
  }
};
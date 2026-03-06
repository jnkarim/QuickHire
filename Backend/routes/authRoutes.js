import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  adminLogin,
  getMe,
  googleCallback,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// routes
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.get("/me", protect, getMe);

// Step 1: redirect user to Google's consent screen
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Step 2: Google redirects back here with a code
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_CLIENT_URL || "http://localhost:5173"}/login?error=google_failed`,
  }),
  googleCallback,
);

export default router;
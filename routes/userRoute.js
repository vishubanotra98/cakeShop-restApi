import express from "express";
import {
  getAdminStats,
  getAdminUsers,
  myProfile,
  registerUser,
  loginUser,
  userLogout
} from "../controllers/userController.js";


import {
  authorizeAdmin,
  authenticateToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateToken, myProfile);
router.post("/login", loginUser)
router.post("/register", registerUser);
router.post("/logout", userLogout)


// Admin Routes
router.get("/admin/users", authenticateToken, authorizeAdmin, getAdminUsers);

router.get("/admin/stats", authenticateToken, authorizeAdmin, getAdminStats);

export default router;

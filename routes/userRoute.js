import express from "express";
import {
  getAdminStats,
  getAdminUsers,
  myProfile,
  registerUser,
} from "../controllers/userController.js";


import {
  authorizeAdmin,
  authenticateToken,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateToken, myProfile);
router.post("/register", registerUser);


// Admin Routes
router.get("/admin/users", authenticateToken, authorizeAdmin, getAdminUsers);

router.get("/admin/stats", authenticateToken, authorizeAdmin, getAdminStats);

export default router;

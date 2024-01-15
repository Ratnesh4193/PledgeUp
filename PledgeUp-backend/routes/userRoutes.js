import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/").get(protect, getUserProfile);

export default router;

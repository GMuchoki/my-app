import express from "express";
import { changePassword, deleteAccount, loggedUser, updateProfile, userDashboard } from "../controllers/userControllers.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", auth, loggedUser);
router.get("/dashboard", auth, userDashboard);
router.post("/settings/update-profile", auth, updateProfile);
router.post("/settings/change-password", auth, changePassword);
router.post("/settings/delete-account", auth, deleteAccount);

export default router;
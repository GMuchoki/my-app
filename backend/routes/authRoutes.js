import express from "express";
import { login, signup, refresh, logout } from "../controllers/authControllers.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", loginLimiter, login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;
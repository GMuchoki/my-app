import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,                 // Max 1000 attempts per 15 minutes (for testing)
    message: {
        message: "Too many login attempts from this IP. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins against the limit
});
import db from "../db/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {  isValidName, isValidPassword, isValidUsername, isValidEmail } from "../utils/validators.js";
import crypto from "crypto";

dotenv.config();

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

// helper to SHA256-hash refresh tokens before storing/comparing
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signAccessToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });

const signRefreshToken = (user) =>
  jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: REFRESH_EXPIRES,
  });

export const signup = (req, res) => {
    const { first_name, middle_name, last_name, username, email, password } = req.body;

    if (!first_name || !last_name || !username || !email || !password) {
        return res.status(400).json({ 
            error: "first_name, last_name, username, email and password are required"
        });
    }

    if (!isValidName(first_name) || !isValidName(last_name)) {
        return res.status(400).json({
            error: "Names must contain only letters, spaces, or hyphens (2–50 characters)",
        });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({
            error: "Username must be 3–20 characters long and contain only letters, numbers, or underscores",
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            error: "Email format is invalid. Example: name@example.com",
        });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({
            error: "Password format invalid. It must be at least 8 characters long and contain uppercase, lowercase, number, and special character (#?!@$%^&*.-_)"
        });
    }

    const hashed = bcrypt.hashSync(password, 10);

    try {
        db.prepare(`INSERT INTO users (first_name, middle_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?, ?)`).run(first_name, middle_name, last_name, username, email, hashed);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        if (err.message.includes("UNIQUE")) {
            res.status(400).json({ error: "Username or email already exists" });
        } else {
            console.error(err);
            res.status(500).json({ error: "Database error" });
        }
    }
};


export const login = (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                error: "username and password are required"
            });
        }

        if (!isValidUsername(username)) {
            return res.status(400).json({
                error: "Invalid username format",
            });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({
                error:
                "Password format invalid. It must be at least 8 characters long and contain uppercase, lowercase, number, and special character (#?!@$%^&*.-_)",
            });
        }

        const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const valid = bcrypt.compareSync(password, user.password);

        if (!valid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Check if JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not set in environment variables");
            console.error("Current environment:", Object.keys(process.env).filter(k => k.includes('JWT')));
            return res.status(500).json({ error: "Server configuration error: JWT_SECRET not found" });
        }

        // generate tokens
        let accessToken, refreshToken;
        try {
            accessToken = signAccessToken(user);
            refreshToken = signRefreshToken(user);
        } catch (tokenError) {
            console.error("Token generation error:", tokenError);
            return res.status(500).json({ error: "Token generation failed: " + tokenError.message });
        }

        // store hashed refresh token
        const hashedRefresh = hashToken(refreshToken);

        db.prepare("UPDATE users SET refresh_token = ? WHERE id = ?").run(hashedRefresh, user.id);

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error during login" });
    }
};

export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "Refresh token required" });

  // find user by hashed token
  const hashed = hashToken(token);

  const user = db.prepare("SELECT * FROM users WHERE refresh_token = ?").get(hashed);

  if (!user) return res.status(403).json({ error: "Invalid refresh token" });

  try {
    // verify the JWT (throws if expired/invalid)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // rotation: create new refresh token and access token
    const newAccessToken = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });
    
    const newRefreshToken = jwt.sign({ id: decoded.id, username: decoded.username }, process.env.JWT_SECRET, { expiresIn: REFRESH_EXPIRES });

    // store new hashed refresh token
    const newHashed = hashToken(newRefreshToken);

    db.prepare("UPDATE users SET refresh_token = ? WHERE id = ?").run(newHashed, user.id);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Refresh token verify failed:", err.message);
    // invalidate refresh token in DB so stolen tokens can't be reused
    db.prepare("UPDATE users SET refresh_token = NULL WHERE id = ?").run(user.id);
    return res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const logout = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required to logout" });
    }

    const hashed = hashToken(refreshToken);

    // clear refresh_token if it matches
    const result = db.prepare("UPDATE users SET refresh_token = NULL WHERE refresh_token = ?").run(hashed);

    if (result.changes > 0) {
        return res.json({ message: "Logged out" });
    } else {
        // token not found or already removed
        return res.status(400).json({ error: "Invalid refresh token" });
    }
};
import express from "express";
import bcrypt from "bcryptjs";
import db from "../db/database.js";
import { isValidPassword, isValidEmail, isValidName } from "../utils/validators.js";

export const loggedUser = (req, res) => {
    const user = db.prepare("SELECT id, first_name, middle_name, last_name, username, email FROM users WHERE id = ?").get(req.user.id);

     if (!user) return res.status(404).json({ error: "User not found" });

     res.json({ user });
};

export const userDashboard = (req, res) => {
    res.json({
        message: `Welcome to your dashboard, ${req.user.username}!`,
        userId: req.user.id,
    });
};

export const updateProfile = (req, res) => {

    const { first_name, middle_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: "first_name, last_name and email are required" });
    }

    if (!isValidName(first_name) || !isValidName(last_name)) {
        return res.status(400).json({ error: "Invalid name format" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    db.prepare("UPDATE users SET first_name = ?, middle_name = ?, last_name = ?, email = ? WHERE id = ?").run(first_name, middle_name || null, last_name, email, req.user.id);

    const updated = db.prepare("SELECT id, first_name, middle_name, last_name, username, email FROM users WHERE id = ?").get(req.user.id);

    res.json({ message: "Profile updated", user: updated });

};

export const changePassword = (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) return res.status(400).json({ error: "oldPassword and newPassword are required" });

    if (!isValidPassword(newPassword)) {
        return res.status(400).json({
        error:
            "New password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (#?!@$%^&*.-_)",
        });
    }

    if (oldPassword === newPassword) {
        return res.status(400).json({ error: "New password must be different from the old password" });
    }

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    const hashed = bcrypt.hashSync(newPassword, 10);

    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hashed, req.user.id);

    db.prepare("UPDATE users SET refresh_token = NULL WHERE id = ?").run(req.user.id);

    res.json({ message: "Password changed successfully" });
};

export const deleteAccount = (req, res) => {
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Prepare statements outside transaction
    const deleteTodos = db.prepare("DELETE FROM todos WHERE user_id = ?");
    const deleteUser = db.prepare("DELETE FROM users WHERE id = ?");

    // Use a transaction to ensure atomicity
    const transaction = db.transaction((userId) => {
      // Delete all todos associated with this user first (to avoid foreign key constraint)
      deleteTodos.run(userId);

      // Delete the user account
      const result = deleteUser.run(userId);

      if (result.changes === 0) {
        throw new Error("Failed to delete user account");
      }
    });

    // Execute the transaction with the user ID
    transaction(req.user.id);
    
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    
    // If it's a foreign key error, provide a more helpful message
    if (error.message && error.message.includes("FOREIGN KEY")) {
      // Try disabling foreign keys temporarily as a workaround
      try {
        db.pragma("foreign_keys = OFF");
        const deleteTodos = db.prepare("DELETE FROM todos WHERE user_id = ?");
        const deleteUser = db.prepare("DELETE FROM users WHERE id = ?");
        
        deleteTodos.run(req.user.id);
        deleteUser.run(req.user.id);
        
        db.pragma("foreign_keys = ON");
        res.json({ message: "Account deleted successfully" });
      } catch (fallbackError) {
        console.error("Fallback delete error:", fallbackError);
        res.status(500).json({ 
          error: "Failed to delete account",
          details: fallbackError.message 
        });
      }
    } else {
      res.status(500).json({ 
        error: "Failed to delete account",
        details: error.message 
      });
    }
  }
};
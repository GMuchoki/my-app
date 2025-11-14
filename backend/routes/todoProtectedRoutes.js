import express from "express";
import { addTodo, deleteTodo, getAllTodos, patchTodo, updateTodo } from "../controllers/todoControllers.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, getAllTodos);

router.post("/", auth, addTodo);

router.put("/:id", auth, updateTodo);

router.patch("/:id", auth, patchTodo);

router.delete("/:id", auth, deleteTodo);

export default router;
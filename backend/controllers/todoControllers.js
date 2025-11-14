import db from "../db/database.js";

export const getAllTodos = (req, res) => {
    const todos = db.prepare("SELECT * FROM todos WHERE user_id = ?").all(req.user.id);

    res.status(200).json({
        todos: todos
    });
};

export const addTodo = (req, res) => {
    const { task, completed = 0 } = req.body;

    if (!task || (completed !== 0 && completed !== 1)) {
        return res.status(400).json({ 
            error: "Invalid task or completed value" 
        });
    }

    const insert = db.prepare("INSERT INTO todos (user_id, task, completed) VALUES (?, ?, ?)").run(req.user.id, task, completed);

    res.status(201).json({
        message: "Task added successfully", 
        id: insert.lastInsertRowid
    });
};

export const updateTodo = (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    const updateTask = db.prepare("UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?").run(task, completed, id, req.user.id);

    if (updateTask.changes > 0) {
        res.status(200).json({
            message: "Task updated successfully"
        });
    } else {
        res.status(404).json({
            error: "Task not found"
        });
    }
};

export const patchTodo = (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;

    const existing = db.prepare("SELECT * FROM todos WHERE id = ? AND user_id = ?").get(id, req.user.id);

    if (!existing) {
        return res.status(404).json({ error: "Task not found" });
    }

    const newTask = task !== undefined ? task : existing.task;
    const newCompleted = completed !== undefined ? completed : existing.completed;

    const update = db.prepare("UPDATE todos SET task = ?, completed = ? WHERE id = ? AND user_id = ?").run(newTask, newCompleted, id, req.user.id);

    if (update.changes > 0) {
        res.status(200).json({
            message: "Task updated successfully",
            updated: { id, user_id: req.user.id, task: newTask, completed: newCompleted }
        });
    } else {
        res.status(500).json({ error: "Failed to update task" });
    }
};

export const deleteTodo = (req, res) => {
    const { id } = req.params;

    const deleteTask = db.prepare("DELETE FROM todos WHERE id = ? AND user_id = ?").run(id, req.user.id);

    if (deleteTask.changes > 0) {
        res.status(200).json({
            message: "Task deleted successfully"
        });
    } else {
        res.status(404).json({
            error: "Task not found"
        });
    }
};
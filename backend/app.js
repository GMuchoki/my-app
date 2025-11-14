import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userProtectedRoutes from "./routes/userProtectedRoutes.js";
import todoProtectedRoutes from "./routes/todoProtectedRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userProtectedRoutes);
app.use("/api/todos", todoProtectedRoutes);

//API Health check
app.get("/", (req, res) => {
    res.json({
        message: "API Running!",
    });
});

export default app;
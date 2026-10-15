import express from "express";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("TaskFlow API está funcionando");
});

export default app;

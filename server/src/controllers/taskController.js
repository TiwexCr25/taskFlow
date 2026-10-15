import {
    getAllTasks,
    createTask as saveTask
} from "../services/taskService.js";

export function getTasks(req, res) {
    res.json(getAllTasks());
}

export function postTask(req, res) {
    const { title, description, priority } = req.body;

    if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
            error: "El título es obligatorio."
        });
    }

    if (
        description !== undefined &&
        typeof description !== "string"
    ) {
        return res.status(400).json({
            error: "La descripción debe ser texto."
        });
    }

    const validPriorities = ["low", "medium", "high"];

    if (
        priority !== undefined &&
        !validPriorities.includes(priority)
    ) {
        return res.status(400).json({
            error: "La prioridad debe ser low, medium o high."
        });
    }

    const task = saveTask({ title, description, priority });

    res.status(201).json(task);
}

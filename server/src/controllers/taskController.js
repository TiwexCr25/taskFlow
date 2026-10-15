import {
    getAllTasks,
    getTaskById,
    createTask as saveTask,
    updateTask as saveTaskChanges
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

export function getTask(req, res) {
    const id = Number(req.params.id);
    const task = getTaskById(id);

    if (!task) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    res.json(task);
}

export function putTask(req, res) {
    const id = Number(req.params.id);
    const { title, description, priority, status } = req.body;

    if (
        title !== undefined &&
        (typeof title !== "string" || !title.trim())
    ) {
        return res.status(400).json({
            error: "El título debe ser texto y no puede estar vacío."
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

    if (
        priority !== undefined &&
        !["low", "medium", "high"].includes(priority)
    ) {
        return res.status(400).json({
            error: "Prioridad inválida."
        });
    }

    if (
        status !== undefined &&
        !["pending", "in_progress", "completed"].includes(status)
    ) {
        return res.status(400).json({
            error: "Estado inválido."
        });
    }

    const task = saveTaskChanges(id, {
        title,
        description,
        priority,
        status
    });

    if (!task) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    res.json(task);
}
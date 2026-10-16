import {
    getAllTasks,
    getTaskById,
    createTask as saveTask,
    updateTask as saveTaskChanges,
    deleteTask as removeTask
} from "../services/taskService.js";


function validateTaskData(data, { partial = false } = {}) {
    const errors = {};

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        return { body: "Los datos enviados no son válidos." };
    }

    if (!partial || "title" in data) {
        if (typeof data.title !== "string" || !data.title.trim()) {
            errors.title = "El título es obligatorio.";
        } else if (data.title.trim().length > 100) {
            errors.title = "El título no puede superar los 100 caracteres.";
        }
    }

    if ("description" in data) {
        if (typeof data.description !== "string") {
            errors.description = "La descripción debe ser texto.";
        } else if (data.description.length > 500) {
            errors.description = "La descripción no puede superar los 500 caracteres.";
        }
    }

    if ("priority" in data) {
        if (!["low", "medium", "high"].includes(data.priority)) {
            errors.priority = "La prioridad debe ser low, medium o high.";
        }
    }

    if ("status" in data) {
        if (!["pending", "in_progress", "completed"].includes(data.status)) {
            errors.status = "El estado de la tarea no es válido.";
        }
    }

    const allowedFields = ["title", "description", "priority", "status"];
    const unknownFields = Object.keys(data).filter(
        (key) => !allowedFields.includes(key)
    );

    if (unknownFields.length > 0) {
        errors.fields = `Campos no permitidos: ${unknownFields.join(", ")}.`;
    }

    return errors;
}


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

    const errors = validateTaskData(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            error: "Los datos de la tarea no son válidos.",
            details: errors
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

    const errors = validateTaskData(req.body, { partial: true });

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            error: "Los datos de la tarea no son válidos.",
            details: errors
        });
    }

    res.json(task);
}

export function deleteTaskController(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El ID debe ser un número entero positivo."
        });
    }

    const task = removeTask(id);

    if (!task) {
        return res.status(404).json({
            error: "Tarea no encontrada."
        });
    }

    res.json({
        message: "Tarea eliminada correctamente.",
        task
    });
}
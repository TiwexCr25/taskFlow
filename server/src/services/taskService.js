import { db } from "../database/db.js";

export function getAllTasks() {
    return db.prepare(`
    SELECT * FROM tasks
    ORDER BY id DESC
  `).all();
}

export function getTaskById(id) {
    return db.prepare(`
    SELECT * FROM tasks
    WHERE id = ?
  `).get(id);
}

export function createTask(data) {
    const title = data.title.trim();
    const description = data.description?.trim() ?? "";
    const priority = data.priority ?? "medium";
    const status = "pending";
    const createdAt = new Date().toISOString();

    const result = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(title, description, priority, status, createdAt);

    return getTaskById(Number(result.lastInsertRowid));
}

export function updateTask(id, data) {
    const currentTask = getTaskById(id);

    if (!currentTask) {
        return undefined;
    }

    const title = data.title ?? currentTask.title;
    const description = data.description ?? currentTask.description;
    const priority = data.priority ?? currentTask.priority;
    const status = data.status ?? currentTask.status;

    db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?, status = ?
    WHERE id = ?
  `).run(title, description, priority, status, id);

    return getTaskById(id);
}

export function deleteTask(id) {
    const task = getTaskById(id);

    if (!task) {
        return undefined;
    }

    db.prepare(`
    DELETE FROM tasks
    WHERE id = ?
  `).run(id);

    return task;
}

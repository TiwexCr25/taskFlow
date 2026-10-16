let tasks = [];
let nextId = 1;

export function getAllTasks() {
    return tasks;
}

export function createTask(data) {
    const task = {
        id: nextId++,
        title: data.title.trim(),
        description: data.description?.trim() ?? "",
        priority: data.priority ?? "medium",
        status: "pending",
        createdAt: new Date().toISOString()
    };

    tasks.push(task);

    return task;
}

export function getTaskById(id) {
    return tasks.find((task) => task.id === id);
}

export function updateTask(id, data) {
    const task = tasks.find((task) => task.id === id);

    if (!task) {
        return undefined;
    }

    if (data.title !== undefined) {
        task.title = data.title.trim();
    }

    if (data.description !== undefined) {
        task.description = data.description.trim();
    }

    if (data.priority !== undefined) {
        task.priority = data.priority;
    }

    if (data.status !== undefined) {
        task.status = data.status;
    }

    return task;
}

export function deleteTask(id) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
        return undefined;
    }

    const deletedTask = tasks.splice(index, 1);

    return deletedTask[0];
}
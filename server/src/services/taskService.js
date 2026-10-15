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

const API_URL = "http://localhost:3000/api/tasks";

const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");


function showMessage(text, type = "") {
    message.textContent = text;

    if (type) {
        message.dataset.type = type;
    } else {
        delete message.dataset.type;
    }
}


// Consultar las tareas al servidor

async function getTasks() {
    try {
        showMessage("Cargando tareas...", "loading");

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No se pudieron cargar las tareas.");
        }

        const tasks = await response.json();

        renderTasks(tasks);
        showMessage("");
    } catch (error) {
        showMessage(
            error.message === "Failed to fetch"
                ? "No se pudo conectar con el servidor. Comprueba que esté encendido."
                : error.message,
            "error"
        );
    }
}


// Mostrar las tareas en la interfaz

function renderTasks(tasks) {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        const item = document.createElement("li");
        item.textContent = "Todavía no tienes tareas.";
        taskList.append(item);
        return;
    }

    tasks.forEach((task) => {
        const item = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent =
            task.description || "Sin descripción";

        const details = document.createElement("p");
        details.textContent =
            `Prioridad: ${task.priority} | Estado: ${task.status}`;

        const statusButton = document.createElement("button");
        statusButton.textContent =
            task.status === "completed"
                ? "Marcar pendiente"
                : "Completar tarea";

        statusButton.addEventListener("click", async () => {
            const newStatus =
                task.status === "completed" ? "pending" : "completed";

            await updateTask(task.id, { status: newStatus });
            await getTasks();
        });

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";

        editButton.addEventListener("click", async () => {
            const newTitle = prompt("Nuevo título:", task.title);

            if (newTitle === null || !newTitle.trim()) {
                return;
            }

            const newDescription = prompt(
                "Nueva descripción:",
                task.description
            );

            if (newDescription === null) {
                return;
            }

            await updateTask(task.id, {
                title: newTitle.trim(),
                description: newDescription
            });

            await getTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";

        deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(
                `¿Quieres eliminar "${task.title}"?`
            );

            if (!confirmed) {
                return;
            }

            await deleteTask(task.id);
            await getTasks();
        });

        item.append(
            title,
            description,
            details,
            statusButton,
            editButton,
            deleteButton
        );

        taskList.append(item);
    });
}


// Crear una tarea mediante POST
async function createTask(taskData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(taskData)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "No se pudo crear la tarea.");
    }

    return result;
}


async function updateTask(id, changes) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(changes)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "No se pudo actualizar la tarea.");
    }

    return result;
}

async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || "No se pudo eliminar la tarea.");
    }

    return result;
}


// Procesar el envío del formulario
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(taskForm);

    const taskData = {
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority")
    };

    try {
        message.textContent = "Creando tarea...";

        await createTask(taskData);

        taskForm.reset();
        await getTasks();

        message.textContent = "Tarea creada correctamente.";
    } catch (error) {
        message.textContent = error.message;
    }
});

// Cargar las tareas al abrir la página
getTasks();

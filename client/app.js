const API_URL = "http://localhost:3000/api/tasks";

const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");

let allTasks = [];

function showMessage(text, type = "") {
    message.textContent = text;

    if (type) {
        message.dataset.type = type;
    } else {
        delete message.dataset.type;
    }
}


async function getErrorMessage(response) {
    try {
        const result = await response.json();

        if (result.details && typeof result.details === "object") {
            return Object.values(result.details).join(" ");
        }

        return result.error || "Ocurrió un error al procesar la solicitud.";
    } catch {
        return "El servidor devolvió una respuesta no válida.";
    }
}


// Consultar las tareas al servidor


async function getTasks() {
    showMessage("Cargando tareas...", "loading");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No se pudieron cargar las tareas.");
        }

        const tasks = await response.json();

        allTasks = tasks;
        renderTasks();
        showMessage("");
        return true;
    } catch (error) {
        showMessage(
            error.message === "Failed to fetch"
                ? "No se pudo conectar con el servidor. Comprueba que esté encendido."
                : error.message,
            "error"
        );

        return false;
    }
}



// Mostrar las tareas en la interfaz


function renderTasks() {
    taskList.replaceChildren();

    const statusFilter = document.querySelector("#status-filter").value;
    const sortOption = document.querySelector("#sort-tasks").value;

    let visibleTasks = [...allTasks];

    // Filtrar por estado
    if (statusFilter !== "all") {
        visibleTasks = visibleTasks.filter(
            (task) => task.status === statusFilter
        );
    }

    // Ordenar las tareas
    const priorityOrder = {
        high: 3,
        medium: 2,
        low: 1
    };

    visibleTasks.sort((a, b) => {
        switch (sortOption) {
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);

            case "title":
                return a.title.localeCompare(b.title, "es", {
                    sensitivity: "base"
                });

            case "priority":
                return priorityOrder[b.priority] - priorityOrder[a.priority];

            case "newest":
            default:
                return new Date(b.createdAt) - new Date(a.createdAt);
        }
    });

    if (visibleTasks.length === 0) {
        const item = document.createElement("li");

        item.textContent = allTasks.length === 0
            ? "Todavía no tienes tareas."
            : "No hay tareas que coincidan con estos filtros.";

        taskList.append(item);
        return;
    }

    visibleTasks.forEach((task) => {
        const item = document.createElement("li");

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "Sin descripción";

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

            try {
                statusButton.disabled = true;
                statusButton.textContent = "Actualizando...";

                await updateTask(task.id, { status: newStatus });
                const loaded = await getTasks();

                if (loaded) {
                    showMessage("Estado de la tarea actualizado.", "success");
                }
            } catch (error) {
                showMessage(error.message, "error");
            } finally {
                statusButton.disabled = false;
            }
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

            try {
                editButton.disabled = true;
                editButton.textContent = "Guardando...";

                await updateTask(task.id, {
                    title: newTitle.trim(),
                    description: newDescription
                });

                const loaded = await getTasks();

                if (loaded) {
                    showMessage("Tarea editada correctamente.", "success");
                }
            } catch (error) {
                showMessage(error.message, "error");
            } finally {
                editButton.disabled = false;
                editButton.textContent = "Editar";
            }
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

            try {
                deleteButton.disabled = true;
                deleteButton.textContent = "Eliminando...";

                await deleteTask(task.id);
                const loaded = await getTasks();

                if (loaded) {
                    showMessage("Tarea eliminada correctamente.", "success");
                }
            } catch (error) {
                showMessage(error.message, "error");
            } finally {
                deleteButton.disabled = false;
                deleteButton.textContent = "Eliminar";
            }
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

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
}




async function updateTask(id, changes) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(changes)
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
}



async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    return response.json();
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

    const submitButton = taskForm.querySelector(
        'button[type="submit"]'
    );

    try {
        submitButton.disabled = true;
        submitButton.textContent = "Creando...";
        showMessage("Creando tarea...", "loading");

        await createTask(taskData);
        taskForm.reset();

        const loaded = await getTasks();

        if (loaded) {
            showMessage("Tarea creada correctamente.", "success");
        }
    } catch (error) {
        showMessage(error.message, "error");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Crear tarea";
    }
});

document.querySelector("#status-filter").addEventListener(
    "change",
    renderTasks
);

document.querySelector("#sort-tasks").addEventListener(
    "change",
    renderTasks
);

// Cargar las tareas al abrir la página
getTasks();

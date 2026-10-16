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
    showMessage("Cargando tareas...", "loading");

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No se pudieron cargar las tareas.");
        }

        const tasks = await response.json();

        renderTasks(tasks);
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

                await getTasks();

                showMessage("Tarea editada correctamente.", "success");
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
                await getTasks();

                showMessage("Tarea eliminada correctamente.", "success");
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


// Cargar las tareas al abrir la página
getTasks();

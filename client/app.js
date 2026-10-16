const API_URL = "http://localhost:3000/api/tasks";

const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const message = document.querySelector("#message");

// Consultar las tareas al servidor
async function getTasks() {
    try {
        message.textContent = "Cargando tareas...";

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("No se pudieron consultar las tareas.");
        }

        const tasks = await response.json();

        renderTasks(tasks);
        message.textContent = "";
    } catch (error) {
        message.textContent = error.message;
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

        item.append(title, description, details);
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

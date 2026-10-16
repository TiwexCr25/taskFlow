# TaskFlow API

API REST para administrar tareas, desarrollada con Node.js, Express y SQLite.

## URL base

Cuando el servidor está ejecutándose localmente:

`http://localhost:3000/api/tasks`

## Endpoints

### 1. Obtener todas las tareas

- **Método:** `GET`
- **Ruta:** `/api/tasks`
- **Descripción:** devuelve todas las tareas, ordenadas por ID descendente.

**Respuesta exitosa:** `200 OK`

```json
[
  {
    "id": 1,
    "title": "Aprender APIs REST",
    "description": "Crear una tarea de práctica",
    "priority": "high",
    "status": "pending",
    "createdAt": "2026-10-16T15:00:00.000Z"
  }
]
```

Si no hay tareas, devuelve un arreglo vacío: `[]`.

### 2. Obtener una tarea por ID

- **Método:** `GET`
- **Ruta:** `/api/tasks/:id`
- **Descripción:** devuelve una tarea específica.

**Respuesta exitosa:** `200 OK`

Devuelve el objeto de la tarea solicitada.

**Errores:**

- `400 Bad Request`: identificador inválido.
- `404 Not Found`: tarea inexistente.

### 3. Crear una tarea

- **Método:** `POST`
- **Ruta:** `/api/tasks`
- **Descripción:** crea una tarea nueva.

**Cuerpo de la solicitud:**

```json
{
  "title": "Estudiar JavaScript",
  "description": "Practicar promesas y fetch",
  "priority": "high"
}
```

Campos:

- `title`: obligatorio, texto de hasta 100 caracteres.
- `description`: opcional, texto de hasta 500 caracteres.
- `priority`: opcional; `low`, `medium` o `high`. El valor predeterminado es `medium`.

El estado inicial es `pending` y la fecha de creación se genera automáticamente.

**Respuesta exitosa:** `201 Created`

Devuelve el objeto de la tarea creada.

**Errores:**

- `400 Bad Request`: datos inválidos.

### 4. Actualizar una tarea

- **Método:** `PUT`
- **Ruta:** `/api/tasks/:id`
- **Descripción:** actualiza los campos enviados de una tarea existente.

**Cuerpo de ejemplo:**

```json
{
  "status": "completed"
}
```

Campos permitidos:

- `title`
- `description`
- `priority`
- `status`

El estado puede ser `pending`, `in_progress` o `completed`. Los campos omitidos conservan su valor actual.

**Respuesta exitosa:** `200 OK`

Devuelve el objeto actualizado.

**Errores:**

- `400 Bad Request`: identificador o datos inválidos.
- `404 Not Found`: tarea inexistente.

### 5. Eliminar una tarea

- **Método:** `DELETE`
- **Ruta:** `/api/tasks/:id`
- **Descripción:** elimina una tarea existente.

**Respuesta exitosa:** `200 OK`

Devuelve un mensaje de confirmación y la tarea eliminada.

**Errores:**

- `400 Bad Request`: identificador inválido.
- `404 Not Found`: tarea inexistente.

## Códigos HTTP

| Código | Significado                |
| ------ | -------------------------- |
| `200`  | Operación exitosa          |
| `201`  | Recurso creado             |
| `400`  | Solicitud inválida         |
| `404`  | Ruta o tarea no encontrada |
| `500`  | Error interno del servidor |

Las respuestas de error incluyen un campo `error`. Los errores de validación también pueden incluir `details`.

## Ejecutar la API

Desde la carpeta `server`:

```bash
npm install
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

La base de datos SQLite se crea localmente cuando se inicia la aplicación por primera vez.

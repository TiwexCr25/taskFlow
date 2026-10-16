# TaskFlow

TaskFlow es una aplicación web para administrar tareas personales. Permite crear, consultar, editar, completar y eliminar tareas, además de filtrarlas por estado y ordenarlas por diferentes criterios.

El proyecto fue desarrollado como práctica de desarrollo full-stack, con un frontend en JavaScript y una API REST que persiste los datos en SQLite.

## Características

- Crear tareas con título, descripción y prioridad.
- Consultar todas las tareas y buscar una tarea por ID mediante la API.
- Editar y eliminar tareas.
- Marcar tareas como pendientes o completadas.
- Filtrar por estado.
- Ordenar por fecha de creación, título y prioridad.
- Validar los datos antes de guardarlos.
- Mostrar estados de carga y mensajes de error.
- Persistir los datos en SQLite.

## Tecnologías

**Frontend**

- HTML
- CSS
- JavaScript
- Fetch API

**Backend**

- Node.js
- Express
- SQLite (`node:sqlite`)

## Requisitos previos

- Node.js instalado.
- npm, incluido con Node.js.
- Un navegador web moderno.
- Git para clonar el repositorio.

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone <URL_DE_TU_REPOSITORIO>
cd "026 TaskFlow"
```

Reemplaza `<URL_DE_TU_REPOSITORIO>` por la URL real de tu repositorio de GitHub.

Instala las dependencias del backend:

```bash
cd server
npm install
```

## Ejecutar la aplicación

### 1. Iniciar el backend

Desde la carpeta `server`:

```bash
npm run dev
```

La API estará disponible en:

`http://localhost:3000`

Para comprobar que funciona, abre esa dirección en el navegador. Debe mostrar el mensaje de que TaskFlow API está funcionando.

### 2. Iniciar el frontend

Abre una segunda terminal desde la raíz del proyecto y ejecuta:

```bash
npx serve client
```

Si el comando solicita instalar `serve`, acepta la instalación temporal.

Abre en el navegador la dirección local que indique la terminal.

Ambos procesos deben permanecer ejecutándose mientras utilizas la aplicación.

## API REST

La API ofrece las siguientes operaciones:

| Método | Endpoint         | Acción                   |
| ------ | ---------------- | ------------------------ |
| GET    | `/api/tasks`     | Obtener todas las tareas |
| GET    | `/api/tasks/:id` | Obtener una tarea        |
| POST   | `/api/tasks`     | Crear una tarea          |
| PUT    | `/api/tasks/:id` | Actualizar una tarea     |
| DELETE | `/api/tasks/:id` | Eliminar una tarea       |

Para ejemplos de cuerpos de solicitud, respuestas y errores, consulta [`server/README.md`](server/README.md).

## Base de datos

TaskFlow utiliza SQLite para guardar las tareas localmente. La base de datos se crea automáticamente al iniciar el backend y se guarda en `server/data/taskflow.db`.

El archivo de la base de datos no se incluye en Git, por lo que una instalación nueva comienza sin las tareas de tu computadora.

## Arquitectura

El backend separa responsabilidades en varias capas:

- **Routes:** relacionan métodos HTTP y rutas con controladores.
- **Controllers:** validan solicitudes y construyen respuestas HTTP.
- **Services:** contienen las operaciones de gestión de tareas y acceso a datos.
- **Database:** inicializa SQLite y define la tabla de tareas.

El frontend consume la API mediante `fetch()`.

## Estado del proyecto

Proyecto educativo local. No requiere alojamiento web ni servicios externos para funcionar.

## Aprendizajes

- Diseño de una API REST.
- Métodos HTTP y códigos de estado.
- Operaciones CRUD.
- Comunicación entre frontend y backend.
- Validación de datos y manejo de errores.
- Persistencia con SQLite.
- Organización modular del código.
- Uso de Git y GitHub.

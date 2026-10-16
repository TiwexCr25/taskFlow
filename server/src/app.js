import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("TaskFlow API está funcionando");
});


/* Ruta no encontrada */
app.use((req, res) => {
    res.status(404).json({
        error: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

/* Manejo global de errores */
app.use((err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            error: "El cuerpo JSON de la solicitud no es válido."
        });
    }

    res.status(500).json({
        error: "Ocurrió un error interno del servidor."
    });
});


export default app;

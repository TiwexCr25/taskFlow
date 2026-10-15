import app from "./src/app.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

/*
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("TaskFlow API está funcionando y cambio aplicado");
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
}); */

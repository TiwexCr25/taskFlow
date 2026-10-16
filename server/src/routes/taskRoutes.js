import { Router } from "express";

import {
    getTasks,
    getTask,
    postTask,
    putTask,
    deleteTaskController
} from "../controllers/taskController.js";

const router = Router();

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", postTask);
router.put("/:id", putTask);
router.delete("/:id", deleteTaskController);

export default router;

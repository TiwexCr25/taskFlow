import { Router } from "express";

import {
    getTasks,
    postTask
} from "../controllers/taskController.js";

const router = Router();

router.get("/", getTasks);
router.post("/", postTask);

export default router;

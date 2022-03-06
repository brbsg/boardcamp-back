import { Router } from "express";
import createCategory from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.post("/categories", createCategory);

export default categoryRouter;

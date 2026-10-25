import  { Router } from "express";
import * as problemController from "../controllers/problem.controller.js";  

const problemRouter = Router();

// GET all
problemRouter.get("/", problemController.getAllProblems);

// GET one by ID — :id is a URL param
problemRouter.get("/:id", problemController.getProblemById);

// POST create
problemRouter.post("/", problemController.createProblem);

// PUT update — not POST, and needs :id
problemRouter.put("/:id", problemController.updateProblem);

// DELETE — not POST, and needs :id
problemRouter.delete("/:id", problemController.deleteProblem);

export default problemRouter;
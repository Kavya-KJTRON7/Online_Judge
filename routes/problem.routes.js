import { Router } from "express";
import * as problemController from "../controllers/problem.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const problemRouter = Router();

// Public routes (anyone can browse questions)
problemRouter.get("/", problemController.getAllProblems);
problemRouter.get("/:id", problemController.getProblemById);

// // Protected routes (require valid JWT login token)
// problemRouter.post("/", authenticate, problemController.createProblem);
// problemRouter.put("/:id", authenticate, problemController.updateProblem);
// problemRouter.delete("/:id", authenticate, problemController.deleteProblem);

// Admins   admins can create, update, or delete problems
problemRouter.post("/", authenticate, authorizeRoles("admin"), problemController.createProblem);
problemRouter.put("/:id", authenticate, authorizeRoles("admin"), problemController.updateProblem);
problemRouter.delete("/:id", authenticate, authorizeRoles("admin"), problemController.deleteProblem);

export default problemRouter;

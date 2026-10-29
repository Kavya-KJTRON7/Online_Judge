import { Router } from "express";
import * as submissionController from "../controllers/submission.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const submissionRouter = Router();

// POST /api/submissions (protected: user must be logged in to submit code)
submissionRouter.post("/", authenticate, submissionController.createSubmission);

export default submissionRouter;

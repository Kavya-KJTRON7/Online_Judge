import { Router } from "express";
import * as submissionController from "../controllers/submission.controller.js";

const submissionRouter = Router();

// POST /api/submissions
submissionRouter.post("/", submissionController.createSubmission);

export default submissionRouter;
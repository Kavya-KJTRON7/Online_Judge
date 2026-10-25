import express from 'express';
import morgan from 'morgan';    
import authRouter from '../routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import problemRouter from '../routes/problem.routes.js';
import submissionRouter from '../routes/submission.routes.js';

const app = express();

app.use(express.json()); 
app.use(morgan("dev"));
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/problems", problemRouter);
app.use("/api/submissions", submissionRouter);

export default app;

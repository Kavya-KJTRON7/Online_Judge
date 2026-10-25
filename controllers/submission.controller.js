import submissionModel from "../models/submission.model.js"; // to save sumbission to db
import problemModel from "../models/problem.model.js";  //to get the prob
import { evaluateSubmission } from "../services/judge.service.js"; //to evaluate code

export async function createSubmission(req, res) {
    const{problemId, language, code} = req.body;

    if (!problemId || !language || !code) {
        return res.status(400).json({message: "problemId, language, and code are required"});
    }

    const problem = await problemModel.findById(problemId);

    if (!problem) {
    return res.status(404).json({message: "Problem not found"});
    }

    // Evaluate submission using Judge wala service
    const evaluationResult = await evaluateSubmission(code, language, problem.testcases);

    //  Save submission  in MongoDB
    
    const submission = await submissionModel.create({
        problemId,
        userId: req.user?.id || req.body.userId,
        language,
        code,
        verdict: evaluationResult.verdict,
        executionTime: evaluationResult.executionTime,
        testCasesPassed: evaluationResult.testCasesPassed,
        totalTestCases: evaluationResult.totalTestCases
    });

    // 5. Return response to user
    res.status(201).json({
        message: "Submission evaluated successfully",
        submission,
        error: evaluationResult.error || null
    });
}
    

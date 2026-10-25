import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function evaluateSubmission(code, language, testcases) {
    // 1. Create a unique folder path for this run 
    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const tempDir = path.join(process.cwd(), "temp", runId);

    try {
        // Make the temp directory
        await fs.mkdir(tempDir, { recursive: true });

        // Write source code to solution.cpp
        const sourcePath = path.join(tempDir, "solution.cpp");
        await fs.writeFile(sourcePath, code);

        // Output executable path
        const outputPath = path.join(tempDir, "solution.out");

        // Compile Cpp Code
        try {
            // Compile inside Docker container
await execPromise(
    `docker run --rm -v "${tempDir}:/app" -w /app gcc:latest g++ solution.cpp -o solution.out`
);
        } 
        
        catch (compileError) {
            return {
                verdict: "Compilation Error",
                error: compileError.stderr || compileError.message,
                executionTime: 0,
                testCasesPassed: 0,
                totalTestCases: testcases.length
            };
        }

        let passedCount = 0;
        let maxExecutionTime = 0;

        // Test Case Loop
        for (const tc of testcases) {
            const inputPath = path.join(tempDir, "input.txt");
            await fs.writeFile(inputPath, tc.input || "");

            const startTime = Date.now();
            let userOutput = "";

            try {

                // Run inside Docker sandbox with memory & network limits
                const { stdout } = await execPromise(
                    `docker run --rm --network none --memory=256m --cpus=1 -v "${tempDir}:/app" -w /app gcc:latest sh -c "./solution.out < input.txt"`,
                    { timeout: 2000 }
                );

                userOutput = stdout;

            } 
            
            catch (runError) {
                // Timeout -> Time Limit Exceeded
                if (runError.killed || runError.signal === "SIGTERM") {
                    return {
                        verdict: "Time Limit Exceeded",
                        executionTime: 2000,
                        testCasesPassed: passedCount,
                        totalTestCases: testcases.length
                    };
                }

                // Crash -> Runtime Error
                return {
                    verdict: "Runtime Error",
                    error: runError.stderr || runError.message,
                    executionTime: Date.now() - startTime,
                    testCasesPassed: passedCount,
                    totalTestCases: testcases.length
                };
            }

            const duration = Date.now() - startTime;
            if (duration > maxExecutionTime) {
                maxExecutionTime = duration;
            }

            const cleanUserOutput = userOutput.trim().replace(/\r\n/g, "\n");
            const cleanExpectedOutput = (tc.expectedOutput || "").trim().replace(/\r\n/g, "\n");

            // Check for Wrong Answer
            if (cleanUserOutput !== cleanExpectedOutput) {
                return {
                    verdict: "Wrong Answer",
                    executionTime: maxExecutionTime,
                    testCasesPassed: passedCount,
                    totalTestCases: testcases.length
                };
            }

            passedCount++;
        } 

        return {
            verdict: "Accepted",
            executionTime: maxExecutionTime,
            testCasesPassed: passedCount,
            totalTestCases: testcases.length
        };

    } finally {
        // remove the temporary directory and clean up
        await fs.rm(tempDir, { recursive: true, force: true });
    }
}
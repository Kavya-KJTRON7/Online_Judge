import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "./api";

//  C++ template for the editor
const DEFAULT_CPP_CODE = `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    int a, b;
    if (cin >> a >> b) {
        cout << a + b;
    }
    return 0;
}
`;

export default function ProblemDetail() {
  const { id } = useParams(); // Gets the problemId from URL: /problem/:id
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(DEFAULT_CPP_CODE);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // get specific problem from MongoDB
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await API.get(`/problems/${id}`);
        setProblem(res.data.problem);
      } catch (err) {
        console.error("Failed to load problem:", err);
      }
    }
    fetchProblem();
  }, [id]);

  //Submit  code to  Docker Judge backend
  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      const res = await API.post("/submissions", {
        problemId: id,
        language: "cpp",
        code: code,
        userId: user._id || "6ab937103240b1549fcfb161" 
      });

      setResult(res.data.submission);
    } catch (err) {
      console.error("Submission failed:", err);
      setResult({ verdict: "Error submitting code", executionTime: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading problem...</div>;
  }

  return (
    <div style={styles.workspace}>
      {/* LEFT PANEL: Problem Description */}
      <div style={styles.leftPanel}>
        <h1 style={styles.title}>{problem.title}</h1>
        <span style={styles.badge}>{problem.difficulty}</span>

        <h3 style={styles.sectionHeader}>Description</h3>
        <p style={styles.desc}>{problem.description}</p>

        <h3 style={styles.sectionHeader}>Examples</h3>
        {problem.testcases && problem.testcases.slice(0, 2).map((tc, idx) => (
          <div key={idx} style={styles.exampleBox}>
            <div><strong>Input:</strong> <code>{tc.input}</code></div>
            <div><strong>Expected Output:</strong> <code>{tc.expectedOutput}</code></div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL: Monaco Editor & Submit */}
      <div style={styles.rightPanel}>
        <div style={styles.editorHeader}>
          <span style={styles.langTag}>Language: C++ (gcc)</span>
          <button onClick={handleSubmit} disabled={submitting} style={styles.submitBtn}>
            {submitting ? "⏳ Running in Docker..." : "▶ Submit Code"}
          </button>
        </div>

        {/* The VS Code Monaco Editor */}
        <div style={styles.editorWrapper}>
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={(newCode) => setCode(newCode || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true
            }}
          />
        </div>

        {/* VERDICT BOX AT BOTTOM */}
        {result && (
          <div style={{
            ...styles.verdictBox,
            backgroundColor: result.verdict === "Accepted" ? "#1e3a2f" : "#3d1e24",
            borderColor: result.verdict === "Accepted" ? "#00b8a3" : "#ff375f"
          }}>
            <div style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: result.verdict === "Accepted" ? "#00b8a3" : "#ff375f"
            }}>
              {result.verdict === "Accepted" ? "🎉 Accepted" : `❌ ${result.verdict}`}
            </div>
            <div style={{ color: "#ccc", fontSize: "13px", marginTop: "4px" }}>
              Runtime: {result.executionTime} ms | Passed: {result.testCasesPassed} / {result.totalTestCases || 1}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  workspace: { display: "flex", height: "calc(100vh - 58px)", backgroundColor: "#1a1a1a", color: "#fff", fontFamily: "sans-serif" },
  leftPanel: { flex: "1", padding: "24px", overflowY: "auto", borderRight: "1px solid #333" },
  rightPanel: { flex: "1.2", display: "flex", flexDirection: "column" },
  title: { fontSize: "24px", margin: "0 0 12px 0" },
  badge: { backgroundColor: "#333", color: "#00b8a3", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" },
  sectionHeader: { fontSize: "16px", color: "#aaa", marginTop: "24px", marginBottom: "8px" },
  desc: { lineHeight: "1.6", color: "#ddd", fontSize: "15px" },
  exampleBox: { backgroundColor: "#262626", padding: "12px", borderRadius: "6px", marginBottom: "12px", fontSize: "14px", lineHeight: "1.6" },
  editorHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", backgroundColor: "#2d2d2d", borderBottom: "1px solid #333" },
  langTag: { color: "#aaa", fontSize: "13px" },
  submitBtn: { backgroundColor: "#2cbb5d", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" },
  editorWrapper: { flex: "1" },
  verdictBox: { padding: "16px", borderTop: "2px solid", minHeight: "60px" }
};
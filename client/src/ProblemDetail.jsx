import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API from "./api";

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
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(DEFAULT_CPP_CODE);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

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
      setResult({
        verdict: err.response?.data?.message || "Error submitting code",
        executionTime: 0
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    const config = {
      Easy: { color: "#00b8a3", bg: "#00b8a318" },
      Medium: { color: "#ffc01e", bg: "#ffc01e18" },
      Hard: { color: "#ff375f", bg: "#ff375f18" }
    }[diff] || { color: "#ccc", bg: "#333" };

    return (
      <span style={{ ...styles.diffBadge, color: config.color, backgroundColor: config.bg }}>
        {diff}
      </span>
    );
  };

  if (!problem) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "#888", marginTop: "16px" }}>Loading problem workspace...</p>
      </div>
    );
  }

  return (
    <div style={styles.workspace}>
      {/* LEFT PANEL: Problem Description & Testcases */}
      <div style={styles.leftPanel}>
        <div style={styles.leftHeader}>
          <Link to="/" style={styles.backLink}>← All Problems</Link>
          <div style={styles.titleRow}>
            <h1 style={styles.problemTitle}>{problem.title}</h1>
            {getDifficultyBadge(problem.difficulty)}
          </div>

          {/* TAGS */}
          <div style={styles.tagWrap}>
            {problem.tags && problem.tags.map((t, idx) => (
              <span key={idx} style={styles.tag}>{t}</span>
            ))}
          </div>

          {/* TABS */}
          <div style={styles.tabBar}>
            <button
              onClick={() => setActiveTab("description")}
              style={{ ...styles.tabBtn, ...(activeTab === "description" ? styles.activeTab : {}) }}
            >
              📄 Description
            </button>
            <button
              onClick={() => setActiveTab("examples")}
              style={{ ...styles.tabBtn, ...(activeTab === "examples" ? styles.activeTab : {}) }}
            >
              🧪 Test Cases ({problem.testcases ? problem.testcases.length : 0})
            </button>
          </div>
        </div>

        {/* TAB CONTENT */}
        <div style={styles.leftContent}>
          {activeTab === "description" && (
            <div style={styles.descriptionText}>
              {problem.description}
            </div>
          )}

          {activeTab === "examples" && (
            <div>
              {problem.testcases && problem.testcases.map((tc, idx) => (
                <div key={idx} style={styles.exampleCard}>
                  <div style={styles.exampleHeader}>Case #{idx + 1}</div>
                  <div style={styles.codeBlockWrap}>
                    <div style={styles.codeLabel}>Input:</div>
                    <pre style={styles.codePre}>{tc.input || "<empty>"}</pre>
                  </div>
                  <div style={styles.codeBlockWrap}>
                    <div style={styles.codeLabel}>Expected Output:</div>
                    <pre style={styles.codePre}>{tc.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Monaco Editor & Submit */}
      <div style={styles.rightPanel}>
        {/* TOOLBAR */}
        <div style={styles.toolbar}>
          <div style={styles.langPill}>
            <span style={{ color: "#007acc", fontWeight: "bold" }}>C++</span>
            <span style={{ color: "#666", fontSize: "11px" }}>gcc 13</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "⏳ Sandboxing in Docker..." : "▶ Submit Code"}
          </button>
        </div>

        {/* CODE EDITOR */}
        <div style={styles.editorArea}>
          <Editor
            height="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={(newCode) => setCode(newCode || "")}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', Consolas, Monaco, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4
            }}
          />
        </div>

        {/* VERDICT CONSOLE FOOTER */}
        {result && (
          <div style={{
            ...styles.consoleFooter,
            backgroundColor: result.verdict === "Accepted" ? "#102319" : "#281216",
            borderTop: `2px solid ${result.verdict === "Accepted" ? "#00b8a3" : "#ff375f"}`
          }}>
            <div style={styles.verdictRow}>
              <div style={{
                fontSize: "17px",
                fontWeight: "700",
                color: result.verdict === "Accepted" ? "#00b8a3" : "#ff375f"
              }}>
                {result.verdict === "Accepted" ? "🎉 Accepted" : `❌ ${result.verdict}`}
              </div>

              <div style={styles.statPills}>
                <span style={styles.statPill}>⏱️ {result.executionTime} ms</span>
                <span style={styles.statPill}>
                  ✓ {result.testCasesPassed} / {result.totalTestCases || 1} passed
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  workspace: {
    display: "flex",
    height: "calc(100vh - 56px)",
    backgroundColor: "#141414",
    color: "#fff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "70vh"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #333",
    borderTop: "3px solid #ffa116",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  leftPanel: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #262626",
    overflow: "hidden"
  },
  leftHeader: {
    padding: "20px 24px 0 24px",
    borderBottom: "1px solid #262626",
    backgroundColor: "#181818"
  },
  backLink: {
    color: "#888",
    fontSize: "12px",
    textDecoration: "none",
    fontWeight: "500",
    marginBottom: "10px",
    display: "inline-block"
  },
  titleRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" },
  problemTitle: { fontSize: "22px", fontWeight: "700", margin: 0, color: "#fff" },
  diffBadge: { padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" },
  tagWrap: { display: "flex", gap: "6px", marginBottom: "16px" },
  tag: { backgroundColor: "#262626", color: "#888", padding: "2px 8px", borderRadius: "4px", fontSize: "11px" },
  tabBar: { display: "flex", gap: "16px" },
  tabBtn: {
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#888",
    padding: "8px 4px",
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: "500"
  },
  activeTab: { color: "#ffa116", borderBottom: "2px solid #ffa116" },
  leftContent: { padding: "24px", overflowY: "auto", flex: "1" },
  descriptionText: { lineHeight: "1.7", color: "#d0d0d0", fontSize: "15px", whiteSpace: "pre-line" },
  exampleCard: { backgroundColor: "#1e1e1e", border: "1px solid #282828", borderRadius: "8px", padding: "14px", marginBottom: "14px" },
  exampleHeader: { fontSize: "12px", color: "#ffa116", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase" },
  codeBlockWrap: { marginBottom: "8px" },
  codeLabel: { fontSize: "11px", color: "#888", marginBottom: "2px" },
  codePre: { backgroundColor: "#141414", padding: "8px 10px", borderRadius: "4px", margin: 0, fontSize: "13px", color: "#eee", fontFamily: "monospace" },
  rightPanel: { flex: "1.3", display: "flex", flexDirection: "column", backgroundColor: "#1e1e1e" },
  toolbar: {
    height: "44px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    backgroundColor: "#181818",
    borderBottom: "1px solid #282828"
  },
  langPill: { display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#222", padding: "4px 10px", borderRadius: "6px", fontSize: "12px" },
  submitBtn: {
    backgroundColor: "#2cbb5d",
    color: "#fff",
    border: "none",
    padding: "7px 18px",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "13px",
    transition: "background 0.2s"
  },
  editorArea: { flex: "1" },
  consoleFooter: { padding: "14px 20px" },
  verdictRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statPills: { display: "flex", gap: "10px" },
  statPill: { backgroundColor: "rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", color: "#ddd" }
};

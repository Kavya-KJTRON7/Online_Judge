import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await API.get("/problems");
        setProblems(res.data.problems || []);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  const getDifficultyConfig = (diff) => {
    if (diff === "Easy") return { color: "#00b8a3", bg: "#00b8a318" };
    if (diff === "Medium") return { color: "#ffc01e", bg: "#ffc01e18" };
    return { color: "#ff375f", bg: "#ff375f18" };
  };

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase()) ||
      (prob.tags && prob.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
    const matchesDiff = difficultyFilter === "All" || prob.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "#888", marginTop: "16px" }}>Loading problem set...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.header}>Problem Set</h1>
          <p style={styles.subHeader}>Sharpen your algorithmic skills with curated challenges.</p>
        </div>

        {/* CONTROLS (SEARCH & FILTER) */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="🔍 Search by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            style={styles.selectFilter}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={{ ...styles.th, width: "8%" }}>#</th>
              <th style={{ ...styles.th, width: "50%" }}>Title</th>
              <th style={{ ...styles.th, width: "18%" }}>Difficulty</th>
              <th style={{ ...styles.th, width: "24%" }}>Tags</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.length === 0 ? (
              <tr>
                <td colSpan="4" style={styles.emptyTd}>No matching problems found.</td>
              </tr>
            ) : (
              filteredProblems.map((prob, idx) => {
                const diffConfig = getDifficultyConfig(prob.difficulty);
                return (
                  <tr key={prob._id} style={styles.tr}>
                    <td style={{ ...styles.td, color: "#666" }}>{idx + 1}</td>
                    <td style={styles.td}>
                      <Link to={`/problem/${prob._id}`} style={styles.titleLink}>
                        {prob.title}
                      </Link>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.diffBadge,
                        color: diffConfig.color,
                        backgroundColor: diffConfig.bg
                      }}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.tagWrap}>
                        {prob.tags && prob.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} style={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "36px auto",
    padding: "0 24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  centerContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh"
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #333",
    borderTop: "3px solid #ffa116",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px"
  },
  header: { color: "#ffffff", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0", letterSpacing: "-0.5px" },
  subHeader: { color: "#888", fontSize: "14px", margin: 0 },
  controls: { display: "flex", gap: "10px" },
  searchInput: {
    padding: "9px 14px",
    backgroundColor: "#1f1f1f",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    width: "220px"
  },
  selectFilter: {
    padding: "9px 12px",
    backgroundColor: "#1f1f1f",
    border: "1px solid #333",
    borderRadius: "8px",
    color: "#ccc",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer"
  },
  tableCard: {
    backgroundColor: "#1c1c1c",
    border: "1px solid #282828",
    borderRadius: "10px",
    overflow: "hidden"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thRow: { backgroundColor: "#222222", borderBottom: "1px solid #2e2e2e" },
  th: {
    padding: "13px 18px",
    color: "#888",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: "600",
    textAlign: "left"
  },
  tr: { borderBottom: "1px solid #262626", transition: "background-color 0.15s ease" },
  td: { padding: "14px 18px", fontSize: "14px", verticalAlign: "middle" },
  emptyTd: { padding: "40px", textAlign: "center", color: "#666", fontSize: "14px" },
  titleLink: { color: "#f0f0f0", textDecoration: "none", fontWeight: "500", transition: "color 0.15s ease" },
  diffBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600"
  },
  tagWrap: { display: "flex", flexWrap: "wrap", gap: "6px" },
  tag: {
    backgroundColor: "#2a2a2a",
    color: "#aaa",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "500"
  }
};

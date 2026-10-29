import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // get problems from the BE when page loads
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
  }, []); // <--run only once on page load"


  const getDifficultyColor = (diff) => {
    if (diff === "Easy") return "#00b8a3"; // Green
    if (diff === "Medium") return "#ffc01e"; // Yellow
    return "#ff375f"; // Red
  };

  if (loading) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "50px" }}>Loading problems...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Problems</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.thRow}>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Difficulty</th>
            <th style={styles.th}>Tags</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((prob) => (
            <tr key={prob._id} style={styles.tr}>
              <td style={styles.td}>
                <Link to={`/problem/${prob._id}`} style={styles.titleLink}>
                  {prob.title}
                </Link>
              </td>
              <td style={{ ...styles.td, color: getDifficultyColor(prob.difficulty), fontWeight: "bold" }}>
                {prob.difficulty}
              </td>
              <td style={styles.td}>
                {prob.tags && prob.tags.map((tag, idx) => (
                  <span key={idx} style={styles.tag}>{tag}</span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "30px auto",
    padding: "0 20px",
    fontFamily: "system-ui, sans-serif"
  },
  header: { color: "#fff", fontSize: "24px", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse", backgroundColor: "#262626", borderRadius: "8px", overflow: "hidden" },
  thRow: { backgroundColor: "#333", textAlign: "left" },
  th: { padding: "14px 16px", color: "#aaa", fontSize: "14px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #3a3a3a" },
  td: { padding: "14px 16px", color: "#ddd", fontSize: "14px" },
  titleLink: { color: "#fff", textDecoration: "none", fontWeight: "500" },
  tag: {
    backgroundColor: "#3a3a3a",
    color: "#ccc",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    marginRight: "6px"
  }
};
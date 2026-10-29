import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>AlgoUni OJ</Link>
        <Link to="/" style={styles.link}>Problems</Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <div style={styles.userBox}>
            <span style={styles.username}>👤 {user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login / Register</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 28px",
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderBottom: "1px solid #333",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  left: { display: "flex", gap: "24px", alignItems: "center" },
  brand: { fontSize: "20px", fontWeight: "bold", color: "#ffa116", textDecoration: "none" },
  link: { color: "#ccc", textDecoration: "none", fontSize: "15px" },
  right: { display: "flex", alignItems: "center" },
  userBox: { display: "flex", gap: "14px", alignItems: "center" },
  username: { color: "#eee", fontSize: "14px", fontWeight: "500" },
  logoutBtn: {
    padding: "6px 12px",
    backgroundColor: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px"
  },
  loginBtn: {
    padding: "6px 14px",
    backgroundColor: "#ffa116",
    color: "#000",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "14px"
  }
};
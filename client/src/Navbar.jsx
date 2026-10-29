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
        <Link to="/" style={styles.brand}>
          <span style={styles.brandIcon}>⚡</span>
          <span>AlgoUni<span style={{ color: "#ffa116" }}>OJ</span></span>
        </Link>
        <Link to="/" style={styles.navLink}>Problems</Link>
      </div>

      <div style={styles.right}>
        {user ? (
          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
            <span style={styles.username}>{user.username}</span>
            <span style={styles.roleBadge}>{user.role || "student"}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Sign In</Link>
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
    padding: "0 28px",
    height: "56px",
    backgroundColor: "#181818",
    borderBottom: "1px solid #282828",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  },
  left: { display: "flex", gap: "28px", alignItems: "center" },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "19px",
    fontWeight: "700",
    color: "#ffffff",
    textDecoration: "none",
    letterSpacing: "-0.5px"
  },
  brandIcon: {
    backgroundColor: "#ffa11622",
    color: "#ffa116",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "14px"
  },
  navLink: {
    color: "#a0a0a0",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "color 0.2s ease"
  },
  right: { display: "flex", alignItems: "center" },
  userBox: { display: "flex", gap: "12px", alignItems: "center" },
  avatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#ffa116",
    color: "#181818",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px"
  },
  username: { color: "#e0e0e0", fontSize: "14px", fontWeight: "500" },
  roleBadge: {
    fontSize: "11px",
    textTransform: "uppercase",
    padding: "2px 6px",
    borderRadius: "4px",
    backgroundColor: "#282828",
    color: "#888",
    fontWeight: "600"
  },
  logoutBtn: {
    padding: "6px 12px",
    backgroundColor: "transparent",
    color: "#ff5252",
    border: "1px solid #ff525244",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    marginLeft: "4px"
  },
  loginBtn: {
    padding: "7px 16px",
    backgroundColor: "#ffa116",
    color: "#181818",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px"
  }
};

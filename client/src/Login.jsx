import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { username, email, password } : { email, password };

      const res = await API.post(endpoint, payload);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isRegister ? "Create an Account" : "Welcome Back"}</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <button type="submit" style={styles.submitBtn}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div style={styles.toggleText}>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            style={styles.toggleLink}
          >
            {isRegister ? "Login here" : "Register here"}
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px)", backgroundColor: "#1a1a1a", fontFamily: "sans-serif" },
  card: { backgroundColor: "#262626", padding: "32px", borderRadius: "8px", width: "100%", maxWidth: "380px", color: "#fff" },
  title: { margin: "0 0 20px 0", fontSize: "22px", textAlign: "center" },
  error: { backgroundColor: "#3d1e24", color: "#ff375f", padding: "10px", borderRadius: "4px", fontSize: "13px", marginBottom: "16px", border: "1px solid #ff375f" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  input: { padding: "12px", backgroundColor: "#333", border: "1px solid #444", borderRadius: "4px", color: "#fff", fontSize: "14px" },
  submitBtn: { padding: "12px", backgroundColor: "#ffa116", border: "none", borderRadius: "4px", color: "#000", fontWeight: "bold", fontSize: "15px", cursor: "pointer", marginTop: "8px" },
  toggleText: { marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#888" },
  toggleLink: { color: "#ffa116", cursor: "pointer", fontWeight: "bold" }
};

 
import { useState } from "react";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { username, email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.user) {
      setUser(data.user);
    } else {
      setMsg(data.message || "Failed");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    setUser(null);
  };

  if (user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome, {user.username}!</h2>
        <p>Email: {user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 300, display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {!isLogin && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>

      {msg && <p style={{ color: "red" }}>{msg}</p>}

      <p>
        {isLogin ? "No account? " : "Already have an account? "}
        <button type="button" onClick={() => { setIsLogin(!isLogin); setMsg(""); }}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}

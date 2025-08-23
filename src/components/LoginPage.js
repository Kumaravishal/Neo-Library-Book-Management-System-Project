import React, { useState } from "react";
import { loginUser } from "../utils/api";   // API call
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [role, setRole] = useState("staff");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password, role });

      if (response.success) {
        console.log("✅ Login successful:", response.user);

        // Save in local storage
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("role", role);
        localStorage.setItem("isAuthenticated", "true");

        alert(`Welcome ${role === "staff" ? "Library Staff" : "System Admin"}!`);
        navigate("/home");
      } else {
        setError(response.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };   // ✅ fixed missing brace

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Neo Library Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-control"
            >
              <option value="staff">Library Staff</option>
              <option value="admin">System Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-control"
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button 
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={goToRegister}
          className="register-btn"
        >
          Register New Account
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

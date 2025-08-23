import React, { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.username || !form.email || !form.password) {
      setError("⚠️ All fields are required!");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(form);
      
      // ✅ Check for success flag in response
      if (result && result.success) {
        alert("✅ Registration successful! Please login.");
        navigate("/login");
      } else {
        setError(result?.message || "Registration failed. Try again.");
      }
    } catch (err) {
      // ✅ Handle both error formats
      const errorMessage = err.message || err.response?.data?.message || "❌ Registration failed. Try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-card">
        <h2 className="title">Create Your Library Account</h2>

        {error && <p className="error">{error}</p>}

        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter a strong password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Select Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="form-control"
          >
            <option value="staff">Library Staff (Primary User)</option>
            <option value="admin">System Administrator (Secondary User)</option>
          </select>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="switch">
          Already have an account?{" "}
          <span
            className="switch-link"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, useAuth } from "../../context/AuthContext";
import "../../styles/auth_styles/SignIn.css";

function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("api/register/api/token/", {
        email: form.email,
        password: form.password,
      });

      login(response.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="form sign-in" onSubmit={handleSubmit}>
        <div className="sigin-head-p">
          <h1>Sign In</h1>
          <p className="sign-in-p">Access your domain portfolio securely</p>
        </div>

        {error && <p className="error-msg-in">{error}</p>}

        <label className="email">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="pass">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="submit-in" type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>.
        </p>
      </form>
    </>
  );
}

export default SignIn;

import React, { useState } from "react";
import "../../styles/auth_styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import { api, useAuth } from "../../context/AuthContext";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [sbut, setSbut] = useState("");
  const [err, setErr] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSbut("Creating Account...");
    setErr(null);

    const userData = {
      fullname: form.fullName,
      email: form.email,
      password: form.password,
    };

    const signInData = {
      email: form.email,
      password: form.password,
    };

    try {
      await api.post("auth/api/register/", userData);
      setSuccessMessage("Account Creation Successful.");

      const signinRedirect = await api.post("auth/api/login/", signInData);

      login(signinRedirect.data);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErr(error.response?.data || "Network Error or Server unavailable");
      console.error("error", error);
    } finally {
      setSbut("");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="form-bg">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-head-p">
          <h1 className="form-head">Create Your Account</h1>
          <p className="sign-up-p">Start Managing your Domain Securely</p>
        </div>

        {err && typeof err === "string" && <p className="error-msg">{err}</p>}

        {successMessage && <h4 className="succ-msg">{successMessage}</h4>}

        <label>Full Name</label>
        {err?.fullname && <small className="error-msg">{err.fullname}</small>}
        <input
          type="text"
          required
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />

        <label>Email</label>
        {err?.email && <small className="error-msg">{err.email}</small>}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        {err?.password && <small className="error-msg">{err.password}</small>}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <p className="instruct">Must be at least 8 characters with symbols</p>

        <button type="submit" disabled={!!sbut}>
          {sbut || "Create Account"}
        </button>

        <span>
          Already have an account? <Link to="/signin">Sign In</Link>
        </span>
      </form>
    </div>
  );
}

export default Register;

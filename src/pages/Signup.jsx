import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const { token, setToken } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateField = (name, value) => {
    let message = "";

    if (name === "name") {
      if (!value.trim()) {
        message = "Name is required";
      } else if (value.length < 6) {
        message = "Name must be at least 6 characters";
      }
    }

    if (name === "email") {
      if (!value) {
        message = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        message = "Enter a valid email";
      }
    }

    if (name === "password") {
      if (!value) {
        message = "Password is required";
      } else if (value.length < 8) {
        message = "Password must be at least 8 characters";
      }
    }

    if (name === "password_confirmation") {
      if (value !== form.password) {
        message = "Passwords do not match";
      }
    }

    setFieldErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const allValid = Object.keys(form).every((field) =>
      validateField(field, form[field])
    );
    if (!allValid) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/signup", form);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4 text-primary">Create Account</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control ${fieldErrors.name ? "is-invalid" : ""}`}
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {fieldErrors.name && (
            <div className="invalid-feedback">{fieldErrors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${fieldErrors.email ? "is-invalid" : ""}`}
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {fieldErrors.email && (
            <div className="invalid-feedback">{fieldErrors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className={`form-control ${
              fieldErrors.password ? "is-invalid" : ""
            }`}
            name="password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {fieldErrors.password && (
            <div className="invalid-feedback">{fieldErrors.password}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${
              fieldErrors.password_confirmation ? "is-invalid" : ""
            }`}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {fieldErrors.password_confirmation && (
            <div className="invalid-feedback">
              {fieldErrors.password_confirmation}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-gradient w-100"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;

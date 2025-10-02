import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const { token, setToken } = useAuth();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let message = "";

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

    setFieldErrors((prev) => ({ ...prev, [name]: message }));
    return message === "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/login", form);

      setToken(res.data.token);

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm p-4">
        <h3 className="mb-4 text-center text-primary">Login</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className={`form-control ${
                fieldErrors.email ? "is-invalid" : ""
              }`}
              value={form.email}
              onChange={handleChange}
              required
            />
            {fieldErrors.email && (
              <div className="invalid-feedback">{fieldErrors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className={`form-control ${
                fieldErrors.password ? "is-invalid" : ""
              }`}
              value={form.password}
              onChange={handleChange}
              required
            />
            {fieldErrors.password && (
              <div className="invalid-feedback">{fieldErrors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-gradient w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-primary">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

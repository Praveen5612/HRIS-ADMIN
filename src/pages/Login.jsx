import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    email: "",
    password: "",
  });

  const companies = [
    "Black Cube Technologies",
    "Acme Corp",
    "Innova Solutions",
    "NextGen Systems",
    "Demo Organization",
  ];

  const submit = (e) => {
    e.preventDefault();

    if (!form.company || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    // DEMO LOGIN (UNCHANGED LOGIC)
    if (form.email === "admin@company.com" && form.password === "1234") {
      const user = {
        email: form.email.trim(),
        company: form.company,
        role: null,
        department: null,
        verified: false,
        loggedAt: new Date().toISOString(),
      };

      localStorage.setItem("auth_user", JSON.stringify(user));
      onLogin(user);
      navigate("/role", { replace: true });
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <h2>Login</h2>

        <label>Company</label>
        <select
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Continue</button>

        <p className="hint">
          Demo: admin@company.com / 1234
        </p>
      </form>
    </div>
  );
}

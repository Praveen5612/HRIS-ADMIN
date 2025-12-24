import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SuperAdmin.css";
import { API_BASE } from "../utils/apiBase";

export default function SuperAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    password: "",
    otp: "",
  });

  // 🔙 BACK TO ROLE SELECTION
  const handleBack = () => {
    localStorage.removeItem("token"); // safe cleanup
    navigate("/login", { replace: true });
  };

  const submitLogin = async (e) => {
    e.preventDefault();

    if (!login.email || !login.password || !login.otp) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/super-admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 🔐 STORE TOKEN
      localStorage.setItem("token", data.token);

      // ✅ GO TO NEW DASHBOARD
      navigate("/super-admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="super-login">
      <form className="card" onSubmit={submitLogin}>
        
        {/* 🔙 BACK BUTTON */}
        <button
          type="button"
          className="back-btn"
          onClick={handleBack}
        >
          ← Back
        </button>

        <h2>Super Admin Login</h2>

        <input
          placeholder="Email"
          value={login.email}
          onChange={(e) => setLogin({ ...login, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={login.password}
          onChange={(e) => setLogin({ ...login, password: e.target.value })}
        />

        <input
          placeholder="OTP"
          value={login.otp}
          onChange={(e) => setLogin({ ...login, otp: e.target.value })}
        />

        <button disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = ({ user, onToggleSidebar, onLogout }) => {
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const initials = user.email.slice(0, 2).toUpperCase();

  /* Close dropdown on outside click */
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <header className="navbar">
      <div className="nav-left">
        <button className="icon-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>

        {/* ✅ COMPANY NAME FROM LOGIN */}
        <span className="nav-title">
          {user.company} Admin
        </span>
      </div>

      <div className="nav-right">
        <div
          className="profile"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <div className="avatar">{initials}</div>
          <span className="email">{user.email}</span>
          <FaChevronDown />
        </div>

        {open && (
          <div className="profile-menu">
            <div className="profile-info">
              <strong>{user.email}</strong>
              <small>{user.company}</small>
            </div>

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("auth_user");
                onLogout();
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

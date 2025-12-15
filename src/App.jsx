import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeePanel from "./pages/EmployeePanel";
import Attendance from "./pages/Attendance";
import LeaveManagement from "./pages/LeaveManagement";
import PayrollManagement from "./pages/PayrollManagement";
import AssetManagement from "./pages/AssetManagement";
import AnnouncementModule from "./pages/AnnouncementModule";
import RecruitmentModule from "./pages/RecruitmentModule";
import HolidaysModule from "./pages/HolidaysModule";
import SettingsModule from "./pages/SettingsModule";
import DepartmentDesignation from "./pages/DepartmentDesignation";
import Companies from "./pages/Companies"


import Sidebar from "./pages/Sidebar";
import Navbar from "./pages/Navbar";
import "./styles/Layout.css";

/* ===============================
   ADMIN LAYOUT (PROTECTED)
================================ */
const AdminLayout = ({ user, setUser, authLoading }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ⏳ WAIT until auth is checked
  if (authLoading) return null;

  // 🔒 Redirect only if user truly not logged in
  if (!user) return <Navigate to="/login" replace />;

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <>
      <Navbar
        user={user}
        onToggleSidebar={toggleSidebar}
        onLogout={() => setUser(null)}
      />

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className={`app-content ${collapsed ? "collapsed" : ""}`}>
        <Routes>
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="employees" element={<EmployeePanel />} />
          <Route path="attendence" element={<Attendance />} />
          <Route path="leavemanagement" element={<LeaveManagement />} />
          <Route path="payroll" element={<PayrollManagement />} />
          <Route path="asset" element={<AssetManagement />} />
          <Route path="announce" element={<AnnouncementModule />} />
          <Route path="recruit" element={<RecruitmentModule />} />
          <Route path="holidays" element={<HolidaysModule />} />
          <Route path="settings" element={<SettingsModule />} />
           <Route path="companies" element={<Companies user={user} />} />
          <Route
            path="departments"
            element={<DepartmentDesignation user={user} />}
          />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Restore login ONCE on app load
  useEffect(() => {
    const saved = localStorage.getItem("auth_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
    setAuthLoading(false); // ⬅️ important
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={setUser} />}
        />

        <Route
          path="/admin/*"
          element={
            <AdminLayout
              user={user}
              setUser={setUser}
              authLoading={authLoading}
            />
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

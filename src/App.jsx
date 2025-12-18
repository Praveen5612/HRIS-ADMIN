import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* AUTH */
import Login from "./pages/Login";
import RoleGate from "./pages/RoleGate";
import CodeVerify from "./pages/CodeVerify";

/* ADMIN PAGES */
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
import Companies from "./pages/Companies";
import Accounts from "./pages/Accounts";
import Softwarereports from "./pages/Softwarereports";
import EmployeeView from "./pages/EmployeeView";
import SuperAdmin from "./pages/SuperAdmin";
import AddHR from "./pages/AddHR";

/* LAYOUT */
import Sidebar from "./pages/Sidebar";
import Navbar from "./pages/Navbar";
import "./styles/Layout.css";

/* ===============================
   ADMIN LAYOUT
================================ */
const AdminLayout = ({ user, setUser }) => {
  const [collapsed, setCollapsed] = useState(false);

  // 🔐 Strict guard
  if (!user || !user.verified || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const logout = () => {
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <>
      <Navbar
        user={user}
        onToggleSidebar={() => setCollapsed(prev => !prev)}
        onLogout={logout}
      />

      <Sidebar collapsed={collapsed} />

      <main className="app-content">
        <Routes>
          <Route path="dashboard" element={<Dashboard user={user} />} />
          <Route path="employees" element={<EmployeePanel />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="leavemanagement" element={<LeaveManagement />} />
          <Route path="payroll" element={<PayrollManagement />} />
          <Route path="asset" element={<AssetManagement />} />
          <Route path="announce" element={<AnnouncementModule />} />
          <Route path="recruit" element={<RecruitmentModule />} />
          <Route path="holidays" element={<HolidaysModule />} />
          <Route path="settings" element={<SettingsModule />} />
          <Route path="companies" element={<Companies user={user} />} />
          <Route path="departments" element={<DepartmentDesignation user={user} />} />
          <Route path="employee/:id" element={<EmployeeView />} />
          <Route path="accounting" element={<Accounts />} />
          <Route path="softwarereports" element={<Softwarereports />} />
          <Route path="hr-management" element={<AddHR />} />


          {/* Admin fallback */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </>
  );
};

/* ===============================
   ROOT APP
================================ */
export default function App() {
  const initialUser = useMemo(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  }, []);

  const [user, setUser] = useState(initialUser);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            user?.role === "SUPER_ADMIN"
              ? <Navigate to="/super-admin" replace />
              : user?.verified && user?.role
              ? <Navigate to="/admin/dashboard" replace />
              : <Login onLogin={setUser} />
          }
        />

        {/* SUPER ADMIN */}
        <Route
          path="/super-admin"
          element={
            user?.role === "SUPER_ADMIN" && user?.verified
              ? <SuperAdmin />
              : <Navigate to="/login" replace />
          }
        />

        {/* ROLE / OTP */}
        <Route path="/role" element={<RoleGate />} />
        <Route path="/verify" element={<CodeVerify onVerify={setUser} />} />

        {/* ADMIN */}
        <Route
          path="/admin/*"
          element={<AdminLayout user={user} setUser={setUser} />}
        />

        {/* GLOBAL FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

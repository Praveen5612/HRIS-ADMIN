import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaFileInvoiceDollar,
  FaBuilding,
  FaBoxOpen,
  FaUserTie,
  FaBullhorn,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ collapsed = false, mobileOpen = false, onCloseMobile }) => {
  const [empOpen, setEmpOpen] = useState(true);
  const [metaOpen, setMetaOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const safeToggle = (setter, value) => {
    if (collapsed) return;
    setter(value);
  };

  return (
    <aside
      className={`sidebar ${collapsed ? "collapsed" : ""} ${
        mobileOpen ? "mobile-open" : ""
      }`}
    >
      <nav className="sidebar-menu">
        {/* DASHBOARD */}
        <NavLink
          to="/admin/dashboard"
          className="menu-item"
          onClick={onCloseMobile}
        >
          <FaHome />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        {/* EMPLOYEE MANAGEMENT */}
        <div
          className="menu-item expandable"
          onClick={() => safeToggle(setEmpOpen, !empOpen)}
        >
          <div className="menu-left">
            <FaUsers />
            {!collapsed && <span>Employee Management</span>}
          </div>
          {!collapsed && (empOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </div>

        {empOpen && !collapsed && (
          <div className="submenu">
            <NavLink to="/admin/employees" className="submenu-item">
              Employees
            </NavLink>
            <NavLink to="/admin/attendance" className="submenu-item">
              Attendance
            </NavLink>
            <NavLink to="/admin/payroll" className="submenu-item">
              Payroll
            </NavLink>
            <NavLink to="/admin/leavemanagement" className="submenu-item">
              Leaves
            </NavLink>
          </div>
        )}

        {/* METADATA */}
        <div
          className="menu-item expandable"
          onClick={() => safeToggle(setMetaOpen, !metaOpen)}
        >
          <div className="menu-left">
            <FaDatabase />
            {!collapsed && <span>Metadata</span>}
          </div>
          {!collapsed && (metaOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </div>

        {metaOpen && !collapsed && (
          <div className="submenu">
            <NavLink to="/admin/departments" className="submenu-item">
              <FaBuilding /> Departments & Designations
            </NavLink>
            <NavLink to="/admin/asset" className="submenu-item">
              <FaBoxOpen /> Assets
            </NavLink>
            <NavLink to="/admin/recruit" className="submenu-item">
              <FaUserTie /> Recruit
            </NavLink>
            <NavLink to="/admin/announce" className="submenu-item">
              <FaBullhorn /> Announcements
            </NavLink>
            <NavLink to="/admin/holidays" className="submenu-item">
              <FaCalendarAlt /> Holidays
            </NavLink>
            <NavLink to="/admin/settings" className="submenu-item">
              <FaCog /> Settings
            </NavLink>
          </div>
        )}

        {/* ACCOUNTS */}
        <div
          className="menu-item expandable"
          onClick={() => safeToggle(setAccountOpen, !accountOpen)}
        >
          <div className="menu-left">
            <FaFileInvoiceDollar />
            {!collapsed && <span>Accounts</span>}
          </div>
          {!collapsed && (accountOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </div>

        {accountOpen && !collapsed && (
          <div className="submenu">
            <NavLink to="/admin/accounting" className="submenu-item">
              Accounting
            </NavLink>
            <NavLink to="/admin/softwarereports" className="submenu-item">
              Software Reports
            </NavLink>
            <NavLink to="/admin/hr-management" className="submenu-item">
              HR Management
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;

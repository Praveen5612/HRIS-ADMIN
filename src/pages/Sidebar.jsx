import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
  FaDatabase,
  FaBuilding,
  FaFileInvoiceDollar,
  FaBoxOpen,
  FaUserTie,
  FaBullhorn,
  FaCalendarAlt,
  FaCog,
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const [empOpen, setEmpOpen] = useState(true);
  const [metaOpen, setMetaOpen] = useState(false);

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
      <div className="sidebar-header">HRIS Admin</div>

      <nav className="sidebar-menu">
        <NavLink
          to="/admin/dashboard"
          className="menu-item"
          onClick={onCloseMobile}
        >
          <FaHome />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

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
            <NavLink to="/admin/employees" className="submenu-item" onClick={onCloseMobile}>
              Employees
            </NavLink>
            <NavLink to="/admin/attendence" className="submenu-item" onClick={onCloseMobile}>
              Attendance
            </NavLink>
            <NavLink to="/admin/payroll" className="submenu-item" onClick={onCloseMobile}>
              Payroll
            </NavLink>
            <NavLink to="/admin/leavemanagement" className="submenu-item" onClick={onCloseMobile}>
              Leaves
            </NavLink>

            <div
              className="submenu-item expandable"
              onClick={() => safeToggle(setMetaOpen, !metaOpen)}
            >
              <FaDatabase /> Metadata
              {metaOpen ? <FaChevronDown /> : <FaChevronRight />}
            </div>

            {metaOpen && (
              <div className="sub-submenu">
                <NavLink to="/admin/departments" className="submenu-item" onClick={onCloseMobile}>
                  <FaBuilding /> Departments & Designations
                </NavLink>
                <NavLink to="/admin/asset" className="submenu-item" onClick={onCloseMobile}>
                  <FaBoxOpen /> Assets
                </NavLink>
                <NavLink to="/admin/recruit" className="submenu-item" onClick={onCloseMobile}>
                  <FaUserTie /> Recruit
                </NavLink>
                <NavLink to="/admin/announce" className="submenu-item" onClick={onCloseMobile}>
                  <FaBullhorn /> Announcements
                </NavLink>
                <NavLink to="/admin/holidays" className="submenu-item" onClick={onCloseMobile}>
                  <FaCalendarAlt /> Holidays
                </NavLink>
                <NavLink to="/admin/settings" className="submenu-item" onClick={onCloseMobile}>
                  <FaCog /> Settings
                </NavLink>
              </div>
            )}
          </div>
        )}

        <NavLink
          to="/admin/accounts"
          className="menu-item"
          onClick={onCloseMobile}
        >
          <FaFileInvoiceDollar />
          {!collapsed && <span>Accounts</span>}
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;

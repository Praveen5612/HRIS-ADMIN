import React, { useMemo, useState } from "react";
import "../styles/EmployeePanel.css";
import { makeEmployees } from "../utils/mockData";
import EmployeeList from "../components/EmployeeList";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeFilters from "../components/EmployeeFilters";

/* =========================
   INITIAL DATA
========================= */
const initialEmployees = makeEmployees(1000);

/* =========================
   HELPERS
========================= */
const getNextEmpId = (employees) => {
  if (!employees.length) return "EMP001";

  const max = Math.max(
    ...employees.map(e => parseInt(e.id.replace("EMP", ""), 10))
  );

  return `EMP${String(max + 1).padStart(3, "0")}`;
};

const EmployeePanel = () => {
  const user = JSON.parse(localStorage.getItem("auth_user"));
  const isAdmin = user?.role === "ADMIN";
  const hrDepartment = user?.department || null;

  const [employees, setEmployees] = useState(initialEmployees);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* =========================
     ROLE-BASED VIEW
  ========================= */
  const visibleEmployees = useMemo(() => {
    if (isAdmin) return employees;
    return employees.filter(e => e.department === hrDepartment);
  }, [employees, isAdmin, hrDepartment]);

  /* =========================
     CREATE / UPDATE
  ========================= */
  const handleSave = (emp) => {
    if (emp.id) {
      setEmployees(prev =>
        prev.map(p => (p.id === emp.id ? { ...p, ...emp } : p))
      );
    } else {
      const newEmployee = {
        ...emp,
        id: getNextEmpId(employees),
        department: isAdmin ? emp.department : hrDepartment,
        active: true,
      };
      setEmployees(prev => [newEmployee, ...prev]);
    }

    setShowForm(false);
    setSelected(null);
  };

  /* =========================
     ACTIONS
  ========================= */
  const handleEdit = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    if (!isAdmin && emp.department !== hrDepartment) return;

    setSelected(emp);
    setShowForm(true);
  };

  const handleDeactivate = (id) => {
    if (!isAdmin) return;
    setEmployees(prev =>
      prev.map(p => (p.id === id ? { ...p, active: false } : p))
    );
  };

  const handleActivate = (id) => {
    if (!isAdmin) return;
    setEmployees(prev =>
      prev.map(p => (p.id === id ? { ...p, active: true } : p))
    );
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    setEmployees(prev => prev.filter(p => p.id !== id));
  };

  /* =========================
     STATS
  ========================= */
  const stats = useMemo(() => ({
    total: visibleEmployees.length,
    active: visibleEmployees.filter(e => e.active).length,
    inactive: visibleEmployees.filter(e => !e.active).length,
  }), [visibleEmployees]);

  return (
    <div className="employee-panel">
      {/* HEADER */}
      <div className="employee-header">
        <h2>Employee Management</h2>

        <div className="header-actions">
          <button
            className="btn"
            onClick={() => {
              setSelected(null);
              setShowForm(true);
            }}
          >
            Add Employee
          </button>

          <div className="stat-mini">
            <span>Total</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-mini">
            <span>Active</span>
            <strong>{stats.active}</strong>
          </div>
          <div className="stat-mini">
            <span>Inactive</span>
            <strong>{stats.inactive}</strong>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="employee-body">
        <EmployeeFilters />

        <EmployeeList
          employees={visibleEmployees}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
      </div>

      {/* FORM */}
      {showForm && (
        <EmployeeForm
          initial={selected}
          onClose={() => {
            setShowForm(false);
            setSelected(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default EmployeePanel;

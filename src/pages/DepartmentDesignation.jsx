import React, { useMemo, useState } from "react";
import { makeEmployees } from "../utils/mockData";
import "../styles/DepartmentDesignation.css";

/**
 * Usage:
 * <DepartmentDesignation user={user} />
 */

export default function DepartmentDesignation({ user }) {
  const isAdmin = user?.role === "ADMIN";

  /* ===============================
     SOURCE DATA
  ================================ */
  const employees = useMemo(() => makeEmployees(500), []);

  /* ===============================
     BASE DEPARTMENT MAP
  ================================ */
  const baseDeptMap = useMemo(() => {
    const map = {};
    employees.forEach((e) => {
      if (!map[e.department]) map[e.department] = [];
      map[e.department].push(e);
    });
    return map;
  }, [employees]);

  /* ===============================
     UI-ONLY OVERLAY DATA
  ================================ */
  const [extraDepartments, setExtraDepartments] = useState([]);
  const [extraDesignations, setExtraDesignations] = useState({});

  /* ===============================
     UI STATE
  ================================ */
  const [selectedDept, setSelectedDept] = useState(null);
  const [newDept, setNewDept] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  /* ===============================
     MERGED DEPARTMENTS
  ================================ */
  const departments = [
    ...Object.keys(baseDeptMap),
    ...extraDepartments,
  ];

  /* ===============================
     ACTIONS
  ================================ */
  const addDepartment = () => {
    const name = newDept.trim();
    if (!name || departments.includes(name)) return;
    setExtraDepartments((p) => [...p, name]);
    setNewDept("");
  };

  const addDesignation = () => {
    const name = newDesignation.trim();
    if (!name || !selectedDept) return;

    setExtraDesignations((p) => ({
      ...p,
      [selectedDept]: [
        ...(p[selectedDept] || []),
        name,
      ],
    }));
    setNewDesignation("");
  };

  /* ===============================
     DESIGNATION STATS
  ================================ */
  const designationStats = useMemo(() => {
    if (!selectedDept) return {};

    const stats = {};

    employees
      .filter((e) => e.department === selectedDept)
      .forEach((e) => {
        stats[e.role] = (stats[e.role] || 0) + 1;
      });

    (extraDesignations[selectedDept] || []).forEach((d) => {
      if (!stats[d]) stats[d] = 0;
    });

    return stats;
  }, [employees, selectedDept, extraDesignations]);

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="dd-page">
      <h2>Departments & Designations</h2>

      {isAdmin && (
        <div className="dd-actions">
          <input
            placeholder="New Department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
          />
          <button onClick={addDepartment}>Add Department</button>
        </div>
      )}

      <div className="dd-grid">
        {/* ===============================
            LEFT: DEPARTMENTS
        ================================ */}
        <div className="card">
          <h3>Departments</h3>
          <ul className="dept-list">
            {departments.map((d) => (
              <li
                key={d}
                className={d === selectedDept ? "active" : ""}
                onClick={() => setSelectedDept(d)}
              >
                <span>{d}</span>
                <span className="count">
                  {baseDeptMap[d]?.length || 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ===============================
            RIGHT: DESIGNATIONS
        ================================ */}
        <div className="card">
          {!selectedDept && (
            <p className="hint">
              Select a department to view designations
            </p>
          )}

          {selectedDept && (
            <>
              {/* Header row */}
              <div className="dept-header">
                <h3>{selectedDept}</h3>
                <div className="emp-count">
                  Employees:{" "}
                  <strong>
                    {baseDeptMap[selectedDept]?.length || 0}
                  </strong>
                </div>
              </div>

              {/* Add designation */}
              {isAdmin && (
                <div className="dd-actions inline">
                  <input
                    placeholder="New Designation"
                    value={newDesignation}
                    onChange={(e) =>
                      setNewDesignation(e.target.value)
                    }
                  />
                  <button onClick={addDesignation}>
                    Add Designation
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Designation</th>
                      <th>Employees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(designationStats).map(
                      ([role, count]) => (
                        <tr key={role}>
                          <td>{role}</td>
                          <td>{count}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "../styles/DepartmentDesignation.css";

const API = import.meta.env.VITE_API_BASE_URL;

export default function DepartmentDesignation({ user }) {
  const isAdmin = user?.role === "COMPANY_ADMIN";
  const isHR = user?.role === "HR";

  /* ===============================
     CAPABILITIES
  ================================ */
  const canCreateDepartment = isAdmin;
  const canEditDepartment = isAdmin || isHR;
  const canDeleteDepartment = isAdmin;

  const canCreateDesignation = isAdmin || isHR;
  const canEditDesignation = isAdmin || isHR;
  const canDeleteDesignation = isAdmin || isHR;

  /* ===============================
     STATE
  ================================ */
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);

  const [newDept, setNewDept] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  const [editingDeptId, setEditingDeptId] = useState(null);
  const [editingDeptName, setEditingDeptName] = useState("");

  const [editingDesigId, setEditingDesigId] = useState(null);
  const [editingDesigName, setEditingDesigName] = useState("");

  const [loading, setLoading] = useState(false);

  const authFetch = (url, options = {}) =>
    fetch(url, { credentials: "include", ...options });

  /* ===============================
     LOADERS
  ================================ */
  const loadDepartments = async () => {
    const res = await authFetch(`${API}/api/departments`);
    if (res.ok) setDepartments(await res.json());
  };

  const loadDesignations = async (dept) => {
    setSelectedDept(dept);

    const res = await authFetch(
      `${API}/api/designations?departmentId=${dept.id}`
    );

    if (!res.ok) return;

    const data = await res.json();
    setDesignations(
      data.map(d => ({ ...d, employeeCount: d.employeeCount ?? 0 }))
    );
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  /* ===============================
     DEPARTMENT CRUD
  ================================ */
  const createDepartment = async () => {
    if (!canCreateDepartment || !newDept.trim()) return;

    setLoading(true);
    const res = await authFetch(`${API}/api/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department_name: newDept.trim() }),
    });
    setLoading(false);

    if (res.ok) {
      setNewDept("");
      loadDepartments();
    }
  };

  const updateDepartment = async (id) => {
    if (!canEditDepartment) return;

    setLoading(true);
    const res = await authFetch(`${API}/api/departments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ department_name: editingDeptName }),
    });
    setLoading(false);

    if (res.ok) {
      setEditingDeptId(null);
      loadDepartments();
    }
  };

  const deleteDepartment = async (dept) => {
    if (!canDeleteDepartment) return;

    if (designations.length > 0) {
      alert("Cannot delete department with designations");
      return;
    }

    if (!confirm("Delete this department?")) return;

    await authFetch(`${API}/api/departments/${dept.id}`, {
      method: "DELETE",
    });

    setSelectedDept(null);
    setDesignations([]);
    loadDepartments();
  };

  /* ===============================
     DESIGNATION CRUD
  ================================ */
  const createDesignation = async () => {
    if (!canCreateDesignation || !newDesignation.trim() || !selectedDept) return;

    setLoading(true);
    const res = await authFetch(`${API}/api/designations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        department_id: selectedDept.id,
        designation_name: newDesignation.trim(),
      }),
    });
    setLoading(false);

    if (res.ok) {
      setNewDesignation("");
      loadDesignations(selectedDept);
    }
  };

  const updateDesignation = async (id) => {
    if (!canEditDesignation) return;

    setLoading(true);
    const res = await authFetch(`${API}/api/designations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designation_name: editingDesigName }),
    });
    setLoading(false);

    if (res.ok) {
      setEditingDesigId(null);
      loadDesignations(selectedDept);
    }
  };

  const deleteDesignation = async (desig) => {
    if (!canDeleteDesignation) return;

    if (desig.employeeCount > 1) {
      alert("Cannot delete designation with employees");
      return;
    }

    if (!confirm("Delete this designation?")) return;

    await authFetch(`${API}/api/designations/${desig.id}`, {
      method: "DELETE",
    });

    loadDesignations(selectedDept);
  };

  /* ===============================
     RENDER
  ================================ */
  return (
    <div className="dd-page">
      <h2>Departments & Designations</h2>

      {canCreateDepartment && (
        <div className="dd-actions">
          <input
            placeholder="New Department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
          />
          <button onClick={createDepartment} disabled={loading}>
            Add Department
          </button>
        </div>
      )}

      <div className="dd-grid">
        {/* LEFT */}
        <div className="card">
          <h3>Departments</h3>

          <ul className="dept-list">
            {departments.map((d) => (
              <li
                key={d.id}
                className={selectedDept?.id === d.id ? "active" : ""}
                onClick={() => loadDesignations(d)}
              >
                {editingDeptId === d.id ? (
                  <>
                    <input
                      value={editingDeptName}
                      onChange={(e) => setEditingDeptName(e.target.value)}
                    />
                    <button onClick={() => updateDepartment(d.id)}>
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{d.department_name}</span>

                    {(canEditDepartment || canDeleteDepartment) && (
                      <div className="row-actions">
                        {canEditDepartment && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDeptId(d.id);
                              setEditingDeptName(d.department_name);
                            }}
                          >
                            Edit
                          </button>
                        )}

                        {canDeleteDepartment && (
                          <button
                            className="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDepartment(d);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="card">
          {!selectedDept ? (
            <p className="hint">Select a department</p>
          ) : (
            <>
              <h3>{selectedDept.department_name}</h3>

              {canCreateDesignation && (
                <div className="dd-actions inline">
                  <input
                    placeholder="New Designation"
                    value={newDesignation}
                    onChange={(e) =>
                      setNewDesignation(e.target.value)
                    }
                  />
                  <button onClick={createDesignation} disabled={loading}>
                    Add Designation
                  </button>
                </div>
              )}

              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Designation</th>
                      <th>Employees</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {designations.map((d) => (
                      <tr key={d.id}>
                        <td>
                          {editingDesigId === d.id ? (
                            <input
                              value={editingDesigName}
                              onChange={(e) =>
                                setEditingDesigName(e.target.value)
                              }
                            />
                          ) : (
                            d.designation_name
                          )}
                        </td>

                        <td>
                          <span className="designation-count">
                            {d.employeeCount}
                          </span>
                        </td>

                        {(canEditDesignation || canDeleteDesignation) && (
                          <td className="row-actions">
                            {editingDesigId === d.id ? (
                              <button
                                onClick={() => updateDesignation(d.id)}
                              >
                                Save
                              </button>
                            ) : (
                              <>
                                {canEditDesignation && (
                                  <button
                                    onClick={() => {
                                      setEditingDesigId(d.id);
                                      setEditingDesigName(
                                        d.designation_name
                                      );
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}

                                {canDeleteDesignation && (
                                  <button
                                    className="danger"
                                    disabled={d.employeeCount > 1}
                                    onClick={() =>
                                      deleteDesignation(d)
                                    }
                                  >
                                    Delete
                                  </button>
                                )}
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
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

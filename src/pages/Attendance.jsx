import React, { useEffect, useMemo, useState } from "react";
import "../styles/Attendance.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { makeEmployees } from "../utils/mockData";

ChartJS.register(ArcElement, Tooltip, Legend);

/* =============================
   CONSTANTS
============================= */
const DEPARTMENTS = [
  "HR",
  "IT",
  "Finance",
  "Sales",
  "Marketing",
  "Operations",
];

const PAGE_SIZE = 20;

/* =============================
   DATE HELPERS
============================= */
const randomStatus = () => {
  const r = Math.random();
  if (r < 0.1) return "L";
  if (r < 0.2) return "A";
  if (r < 0.3) return "M";
  return "P";
};

const getDateRange = (from, to) => {
  const dates = [];
  const start = new Date(from + "-01");
  const end = new Date(to + "-01");
  end.setMonth(end.getMonth() + 1);

  while (start < end) {
    if (start.getDay() !== 0) {
      dates.push(start.toISOString().slice(0, 10));
    }
    start.setDate(start.getDate() + 1);
  }
  return dates;
};

/* =============================
   COMPONENT
============================= */
export default function Attendance() {
  /* Entry */
  const [department, setDepartment] = useState(null);

  /* Filters */
  const [search, setSearch] = useState("");
  const [designation, setDesignation] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromMonth, setFromMonth] = useState("2024-06");
  const [toMonth, setToMonth] = useState("2024-07");

  /* Pagination */
  const [page, setPage] = useState(1);

  /* Employees */
  const employees = useMemo(() => {
    if (!department) return [];
    return makeEmployees(400).filter(e => e.department === department);
  }, [department]);

  /* Dates */
  const dates = useMemo(
    () => getDateRange(fromMonth, toMonth),
    [fromMonth, toMonth]
  );

  /* Attendance State */
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    if (!department) return;

    const data = {};
    employees.forEach(e => {
      data[e.id] = {};
      dates.forEach(d => {
        const status = randomStatus();
        data[e.id][d] = {
          status,
          request:
            status === "M"
              ? { state: "PENDING", reason: "Network issue" }
              : null,
        };
      });
    });

    setAttendance(data);
    setPage(1);
  }, [employees, dates, department]);

  /* Filtered Employees */
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchSearch =
        e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.name.toLowerCase().includes(search.toLowerCase());

      const matchRole = !designation || e.role === designation;

      const matchStatus =
        !statusFilter ||
        Object.values(attendance[e.id] || {}).some(
          d => d.status === statusFilter
        );

      return matchSearch && matchRole && matchStatus;
    });
  }, [employees, search, designation, statusFilter, attendance]);

  /* Pagination */
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);

  const paginatedEmployees = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredEmployees.slice(start, start + PAGE_SIZE);
  }, [filteredEmployees, page]);

  /* Pending Requests */
  const pendingRequests = useMemo(() => {
    const list = [];
    paginatedEmployees.forEach(e => {
      Object.entries(attendance[e.id] || {}).forEach(([day, d]) => {
        if (d.request?.state === "PENDING") {
          list.push({ emp: e, day });
        }
      });
    });
    return list;
  }, [paginatedEmployees, attendance]);

  /* Approve / Reject */
  const actOnRequest = (empId, day, decision) => {
    setAttendance(prev => ({
      ...prev,
      [empId]: {
        ...prev[empId],
        [day]:
          decision === "APPROVE"
            ? { status: "P", source: "MANUAL_BY_HR" }
            : {
                ...prev[empId][day],
                request: { ...prev[empId][day].request, state: "REJECTED" },
              },
      },
    }));
  };

  /* Pie Chart */
  const pieData = useMemo(() => {
    let p = 0, a = 0, l = 0, m = 0;
    filteredEmployees.forEach(e =>
      Object.values(attendance[e.id] || {}).forEach(d => {
        if (d.status === "P") p++;
        else if (d.status === "A") a++;
        else if (d.status === "L") l++;
        else if (d.status === "M") m++;
      })
    );
    return {
      labels: ["Present", "Absent", "Leave", "Missing"],
      datasets: [
        {
          data: [p, a, l, m],
          backgroundColor: ["#22c55e", "#ef4444", "#f59e0b", "#8b5cf6"],
        },
      ],
    };
  }, [attendance, filteredEmployees]);

  /* Export (DATE-BASED COLUMNS) */
  const exportCSV = () => {
    const rows = paginatedEmployees.map(e => {
      const row = {
        EmpID: e.id,
        Name: e.name,
        Designation: e.role,
      };
      dates.forEach(d => {
        row[d] = attendance[e.id]?.[d]?.status || "";
      });
      return row;
    });

    const csv = [
      Object.keys(rows[0]).join(","),
      ...rows.map(r => Object.values(r).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${department}_attendance_${fromMonth}_to_${toMonth}.csv`;
    a.click();
  };

  /* =============================
     RENDER
  ============================= */

  if (!department) {
    return (
      <div className="attendance-page">
        <h2>Select Department</h2>
        <div className="dept-grid">
          {DEPARTMENTS.map(d => (
            <button key={d} className="dept-btn" onClick={() => setDepartment(d)}>
              {d}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="attendance-page">
      <h2>{department} Attendance</h2>

      {/* Charts + Requests */}
      <div className="charts">
        <div className="card">
          <Pie data={pieData} />
        </div>

        <div className="card hr-panel">
          <h4>Pending Requests</h4>
          {pendingRequests.length === 0 && <p>No pending requests</p>}
          {pendingRequests.map((r, i) => (
            <div key={i} className="request-row">
              <div>
                <strong>{r.emp.name}</strong>
                <div>{r.emp.role} — {r.day}</div>
              </div>
              <div>
                <button onClick={() => actOnRequest(r.emp.id, r.day, "APPROVE")}>
                  Approve
                </button>
                <button
                  className="danger"
                  onClick={() => actOnRequest(r.emp.id, r.day, "REJECT")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="controls">
        <input placeholder="Search ID / Name" onChange={e => setSearch(e.target.value)} />

        <select onChange={e => setDesignation(e.target.value)}>
          <option value="">All Designations</option>
          {[...new Set(employees.map(e => e.role))].map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <select onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="P">Present</option>
          <option value="A">Absent</option>
          <option value="M">Missing</option>
          <option value="L">Leave</option>
        </select>

        <input type="month" value={fromMonth} onChange={e => setFromMonth(e.target.value)} />
        <input type="month" value={toMonth} onChange={e => setToMonth(e.target.value)} />

        <button onClick={exportCSV}>Export</button>
      </div>

      {/* Table */}
      <div className="table-box">
        <table>
          <thead>
            <tr>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Designation</th>
              {dates.map(d => (
                <th key={d}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>{e.name}</td>
                <td>{e.role}</td>
                {dates.map(d => (
                  <td className={`status ${attendance[e.id]?.[d]?.status}`}>
                    {attendance[e.id]?.[d]?.status}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

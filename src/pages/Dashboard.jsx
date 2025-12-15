import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

/* =======================
   Charts
======================= */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { makeEmployees } from "../utils/mockData.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

/* =======================
   CONSTANTS
======================= */
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DEPARTMENTS = ["HR","Finance","IT","Sales","Operations","Marketing"];

// 🔹 SAME COMPANIES AS LOGIN
const COMPANIES = [
  "Black Cube Technologies",
  "Acme Corp",
  "Innova Solutions",
  "NextGen Systems",
  "Demo Organization",
];

/* =======================
   ATTENDANCE ENGINE
======================= */
function generateAttendance(employees) {
  const weekly = {};
  const deptWise = {};
  const heatmap = {};
  const lateArrivals = {};

  DAYS.forEach(d => {
    weekly[d] = 0;
    heatmap[d] = {};
    DEPARTMENTS.forEach(dep => (heatmap[d][dep] = 0));
  });

  DEPARTMENTS.forEach(dep => {
    deptWise[dep] = 0;
    lateArrivals[dep] = 0;
  });

  employees.forEach(emp => {
    DAYS.forEach(day => {
      const present = Math.random() < 0.9;
      if (!present) return;

      weekly[day]++;
      deptWise[emp.department]++;
      heatmap[day][emp.department]++;

      const arrivalMinutes = Math.floor(Math.random() * 90) + 540;
      if (arrivalMinutes > 615) lateArrivals[emp.department]++;
    });
  });

  return { weekly, deptWise, heatmap, lateArrivals };
}

/* =======================
   DASHBOARD
======================= */
const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  // 🔐 Active company context (refresh-safe)
  const activeCompany =
    localStorage.getItem("active_company") || user?.company || "Company";

  const employees = useMemo(() => makeEmployees(1000), []);
  const attendance = useMemo(
    () => generateAttendance(employees),
    [employees]
  );

  /* =======================
     KPIs
  ======================= */
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  const processedSalary = Math.floor(totalSalary * 0.85);
  const pendingSalary = totalSalary - processedSalary;

  const todayIndex = new Date().getDay();
  const todayKey =
    todayIndex >= 1 && todayIndex <= 5 ? DAYS[todayIndex - 1] : null;

  const presentToday = todayKey ? attendance.weekly[todayKey] : 0;
  const absentToday = todayKey ? employees.length - presentToday : 0;
  const onLeave = Math.floor(employees.length * 0.05);

  /* =======================
     CHARTS
  ======================= */
  const weeklyChart = {
    labels: DAYS,
    datasets: [{
      label: "Attendance",
      data: DAYS.map(d => attendance.weekly[d]),
      backgroundColor: "#38bdf8",
      borderRadius: 8,
    }],
  };

  const deptChart = {
    labels: DEPARTMENTS,
    datasets: [{
      label: "Department Attendance",
      data: DEPARTMENTS.map(d => attendance.deptWise[d]),
      backgroundColor: "#22c55e",
      borderRadius: 8,
    }],
  };

  const lateChart = {
    labels: DEPARTMENTS,
    datasets: [{
      label: "Late Arrivals",
      data: DEPARTMENTS.map(d => attendance.lateArrivals[d]),
      backgroundColor: "#facc15",
      borderRadius: 8,
    }],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">
        {activeCompany} — HR Dashboard
      </h2>

      {/* ================= KPI GRID ================= */}
      <div className="stats-grid four-col">
        <KPI title="Total Employees" value={employees.length} onClick={() => navigate("/admin/employees")} />
        <KPI title="Present Today" value={presentToday} onClick={() => navigate("/admin/attendence")} />
        <KPI title="Absent Today" value={absentToday} onClick={() => navigate("/admin/attendence")} />
        <KPI title="On Leave" value={onLeave} onClick={() => navigate("/admin/leavemanagement")} />

        <KPI title="Total Salary" value={`₹${totalSalary.toLocaleString()}`} onClick={() => navigate("/admin/accounts")} />
        <KPI title="Salary Processed" value={`₹${processedSalary.toLocaleString()}`} type="success" onClick={() => navigate("/admin/accounts")} />
        <KPI title="Salary Pending" value={`₹${pendingSalary.toLocaleString()}`} type="warning" onClick={() => navigate("/admin/accounts")} />
        <KPI title="Companies" value={COMPANIES.length} onClick={() => navigate("/admin/companies")} />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="split-section">
        <section className="chart-section">
          <h3>Weekly Attendance</h3>
          <Bar data={weeklyChart} />
        </section>

        <section className="chart-section">
          <h3>Late Arrivals by Department</h3>
          <Bar data={lateChart} />
        </section>
      </div>

      <div className="split-section">
        <section className="chart-section">
          <h3>Department-wise Attendance</h3>
          <Bar data={deptChart} />
        </section>

        <section className="chart-section heatmap">
          <h3>Attendance Heatmap (Accounting Insight)</h3>
          {DAYS.map(day => (
            <div key={day} className="heatmap-row">
              <span>{day}</span>
              {DEPARTMENTS.map(dep => (
                <div
                  key={dep}
                  className="heatmap-cell"
                  style={{
                    opacity:
                      attendance.heatmap[day][dep] / employees.length
                  }}
                />
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

/* =======================
   KPI CARD
======================= */
const KPI = ({ title, value, type, onClick }) => (
  <div
    className={`stat-card ${type || ""}`}
    onClick={onClick}
    role="button"
  >
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

export default Dashboard;

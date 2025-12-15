import React, { useMemo } from "react";
import { makeEmployees } from "../utils/mockData";
import "../styles/Companies.css";

/* SAME COMPANIES AS LOGIN */
const COMPANY_NAMES = [
  "Black Cube Technologies",
  "Acme Corp",
  "Innova Solutions",
  "NextGen Systems",
  "Demo Organization",
];

export default function Companies({ user }) {
  const employees = useMemo(() => makeEmployees(1000), []);

  /* MAP EMPLOYEES → COMPANIES → DEPARTMENTS → DESIGNATIONS */
  const companies = useMemo(() => {
    return COMPANY_NAMES.map((name, i) => {
      const companyEmployees = employees.filter((_, idx) => idx % COMPANY_NAMES.length === i);

      const deptMap = {};
      companyEmployees.forEach((e) => {
        if (!deptMap[e.department]) deptMap[e.department] = new Set();
        deptMap[e.department].add(e.role);
      });

      return {
        id: i + 1,
        name,
        departments: Object.entries(deptMap).map(([dept, roles]) => ({
          name: dept,
          designations: Array.from(roles),
        })),
      };
    });
  }, [employees]);

  if (!companies.length) {
    return <p style={{ padding: 20 }}>No companies found</p>;
  }

  return (
    <div className="companies-page">
      <h2>Companies</h2>

      {companies.map((c) => {
        const isOwnCompany = c.name === user.company;

        return (
          <div
            key={c.id}
            className={`company-card ${isOwnCompany ? "active" : ""}`}
          >
            <div className="company-header">
              <h3>{c.name}</h3>

              <div className="company-actions">
                {isOwnCompany ? (
                  <span className="editable-badge">Editable</span>
                ) : (
                  <span className="readonly-badge">Read Only</span>
                )}
              </div>
            </div>

            {c.departments.map((d) => (
              <div key={d.name} className="dept-block">
                <strong>{d.name}</strong>
                <div className="roles">
                  {d.designations.map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              </div>
            ))}

            <div className="billing-info">
              Plan: <strong>Enterprise</strong> • Users: <strong>1000</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
}

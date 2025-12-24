import { useEffect, useState } from "react";
import "../styles/EmployeeForm.css";
import { getDesignationsByDepartment } from "../api/master.api";
import { getLastEmployeeCode } from "../api/employees.api";

/* ===============================
   CONSTANTS
=============================== */
const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 India" },
  { code: "+1", label: "🇺🇸 USA" },
  { code: "+44", label: "🇬🇧 UK" },
  { code: "+61", label: "🇦🇺 Australia" },
  { code: "+81", label: "🇯🇵 Japan" },
  { code: "+49", label: "🇩🇪 Germany" },
  { code: "+33", label: "🇫🇷 France" },
  { code: "+971", label: "🇦🇪 UAE" },
  { code: "+65", label: "🇸🇬 Singapore" },
  { code: "+86", label: "🇨🇳 China" },
  { code: "+7", label: "🇷🇺 Russia" },
];

const EMPTY_FORM = {
  employee_code: "",
  full_name: "",
  email: "",
  country_code: "+91",
  phone: "",
  department_id: "",
  designation_id: "",
  joining_date: "",
  salary: "",
  employment_type: "PERMANENT",
  password: "",
};

const EmployeeForm = ({ initial, onClose, onSave, departments = [] }) => {
  const isEdit = Boolean(initial);

  const [form, setForm] = useState(EMPTY_FORM);
  const [designations, setDesignations] = useState([]);
  const [loadingDesignations, setLoadingDesignations] = useState(false);
  const [lastEmpCode, setLastEmpCode] = useState("—");

  /* ===============================
     PREFILL / RESET
  =============================== */
  useEffect(() => {
    if (initial) {
      setForm({
        ...EMPTY_FORM,
        ...initial,
        password: "",
        joining_date: initial.joining_date?.slice(0, 10) || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  /* ===============================
     AUTO-GENERATE EMP CODE
  =============================== */
  useEffect(() => {
    if (isEdit) return;

    let mounted = true;
    setLastEmpCode("Loading...");

    getLastEmployeeCode()
      .then((res) => {
        if (!mounted) return;

        const last = res?.last_employee_code;
        setLastEmpCode(last || "—");

        if (last) {
          const next = Number(last.replace(/\D/g, "")) + 1;
          setForm((p) => ({
            ...p,
            employee_code: `EMP${String(next).padStart(3, "0")}`,
          }));
        }
      })
      .catch(() => mounted && setLastEmpCode("Unable to fetch"));

    return () => {
      mounted = false;
    };
  }, [isEdit]);

  /* ===============================
     LOAD DESIGNATIONS
  =============================== */
  useEffect(() => {
    if (!form.department_id) {
      setDesignations([]);
      return;
    }

    setLoadingDesignations(true);
    getDesignationsByDepartment(form.department_id)
      .then(setDesignations)
      .catch(() => setDesignations([]))
      .finally(() => setLoadingDesignations(false));
  }, [form.department_id]);

  /* RESET DESIGNATION ON DEPT CHANGE */
  useEffect(() => {
    setForm((p) => ({ ...p, designation_id: "" }));
  }, [form.department_id]);

  const change = (key, value) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* ===============================
     SUBMIT
  =============================== */
  const submit = (e) => {
    e.preventDefault();

    if (
      !form.employee_code ||
      !form.full_name.trim() ||
      !form.department_id ||
      !form.designation_id ||
      !form.joining_date ||
      Number(form.salary) <= 0
    ) {
      alert("Please fill all required fields correctly");
      return;
    }

    if (new Date(form.joining_date) > new Date()) {
      alert("Joining date cannot be in the future");
      return;
    }

    if (!isEdit && form.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (form.phone && form.phone.length < 10) {
      alert("Invalid phone number");
      return;
    }

    const payload = {
      employee_code: form.employee_code.trim(),
      full_name: form.full_name.trim(),
      email: form.email?.trim() || null,
      country_code: form.country_code,
      phone: form.phone || null,
      department_id: Number(form.department_id),
      designation_id: Number(form.designation_id),
      joining_date: form.joining_date,
      salary: Number(form.salary),
      employment_type: form.employment_type,
    };

    if (!isEdit) payload.password = form.password;

    onSave(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>{isEdit ? "Edit Employee" : "Add Employee"}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form className="emp-form" onSubmit={submit}>
          {/* EMP CODE + NAME */}
          <div className="row">
            <div className="field">
              <input
                type="text"
                value={form.employee_code}
                onChange={(e) =>
                  change("employee_code", e.target.value.toUpperCase())
                }
                readOnly={isEdit}     // 🔑 key line
                placeholder="Employee Code"
              />

              {!isEdit && (
                <small className="hint">
                  Last: <b>{lastEmpCode}</b>
                </small>
              )}
            </div>

            <input
              type="text"
              placeholder="Full name (Govt ID)"
              value={form.full_name}
              onChange={(e) => change("full_name", e.target.value)}
            />
          </div>

          {/* EMAIL + PHONE */}
          <div className="row">
            <input
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) => change("email", e.target.value)}
            />

            <div className="phone-group">
              <select
                className="country-code"
                value={form.country_code}
                onChange={(e) =>
                  change("country_code", e.target.value)
                }
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label} ({c.code})
                  </option>
                ))}
              </select>

              <input
                className="phone-input"
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) =>
                  change("phone", e.target.value.replace(/\D/g, ""))
                }
                maxLength="15"
              />
            </div>
          </div>

          {/* PASSWORD */}
          {!isEdit && (
            <input
              type="password"
              placeholder="Temporary Password"
              value={form.password}
              onChange={(e) =>
                change("password", e.target.value)
              }
            />
          )}
          <br /><br />

          {/* DEPARTMENT + DESIGNATION */}
          <div className="row">
            <select
              value={form.department_id}
              onChange={(e) =>
                change("department_id", e.target.value)
              }
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.department_name}
                </option>
              ))}
            </select>

            <select
              value={form.designation_id}
              disabled={!form.department_id || loadingDesignations}
              onChange={(e) =>
                change("designation_id", e.target.value)
              }
            >
              <option value="">
                {loadingDesignations
                  ? "Loading..."
                  : "Select Designation"}
              </option>
              {designations.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.designation_name}
                </option>
              ))}
            </select>
          </div>

          {/* DATE + SALARY */}
          <div className="row">
            <input
              type="date"
              value={form.joining_date}
              onChange={(e) =>
                change("joining_date", e.target.value)
              }
            />
            <input
              type="number"
              min="1"
              placeholder="Salary"
              value={form.salary}
              onChange={(e) =>
                change("salary", e.target.value)
              }
            />
          </div>

          {/* EMP TYPE */}
          <select
            value={form.employment_type}
            onChange={(e) =>
              change("employment_type", e.target.value)
            }
          >
            <option value="PERMANENT">Permanent</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
          </select>

          <div className="form-actions">
            <button className="btn primary" type="submit">
              Save
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;

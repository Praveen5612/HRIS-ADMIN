/* ======================================================
   ASSET GENERATOR (DUMMY / MOCK DATA)
   PURPOSE:
   - Generate realistic asset records
   - NO React, NO UI, NO roles
====================================================== */

const ASSET_TYPES = [
  { type: "Laptop", prefix: "LAP" },
  { type: "Mobile", prefix: "MOB" },
  { type: "SIM", prefix: "SIM" },
  { type: "ID Card", prefix: "IDC" },
  { type: "Tablet", prefix: "TAB" },
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomStatus = () =>
  Math.random() > 0.6 ? "Assigned" : "Available";

const nowIso = () => new Date().toISOString();

/* ======================================================
   MAIN GENERATOR
====================================================== */
export function makeAssets(employees = [], count = 60) {
  return Array.from({ length: count }).map((_, i) => {
    const assetType = randomItem(ASSET_TYPES);
    const status = randomStatus();

    const emp =
      status === "Assigned" && employees.length
        ? randomItem(employees)
        : null;

    return {
      id: `AST-${1000 + i}`,
      type: assetType.type,
      tag: `${assetType.prefix}-${2000 + i}`,
      status,
      assignedTo: emp ? emp.id : null,
      department: emp ? emp.department : null,
      createdAt: nowIso(),
      history: [
        {
          at: nowIso(),
          action: "Created",
          by: "System",
        },
        ...(emp
          ? [
              {
                at: nowIso(),
                action: "Assigned",
                to: emp.id,
                by: "Admin",
              },
            ]
          : []),
      ],
    };
  });
}

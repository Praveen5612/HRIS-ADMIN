import { makeEmployees } from "./mockData.js";
import { makeAssets } from "./assetGenerator";

/* ======================================================
   SINGLE SOURCE OF MOCK DATA (ENTERPRISE STYLE)
====================================================== */

export function bootstrapMockData({
  employeeCount = 1000,
  assetCount = 120,
} = {}) {
  const employees = makeEmployees(employeeCount);
  const assets = makeAssets(employees, assetCount);

  return {
    employees,
    assets,
  };
}

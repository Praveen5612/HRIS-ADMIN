export const canEditEmployee = (user, employee) => {
  if (user.role === "ADMIN") return true;

  if (user.role === "HR") {
    return employee.department === user.department;
  }

  return false;
};

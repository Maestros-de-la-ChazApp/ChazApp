export const getRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userRole");
};

export const isAdmin = (): boolean => {
  const role = getRole();
  return role?.toUpperCase() === "ADMINISTRADOR" || role?.toUpperCase() === "ADMIN";
};

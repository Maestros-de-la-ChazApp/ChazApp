export const decodeJwtPayload = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    let base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT payload:", e);
    return null;
  }
};

export const getRole = (): string | null => {
  if (typeof window === "undefined") return null;
  let role = localStorage.getItem("userRole");
  if (!role) {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && (payload.rol || payload.role)) {
        role = payload.rol || payload.role;
        if (role) {
          localStorage.setItem("userRole", role);
        }
      }
    }
  }
  return role;
};

export const isAdmin = (): boolean => {
  const role = getRole();
  if (!role) return false;
  const upper = role.toUpperCase().trim();
  return (
    upper === "ADMINISTRADOR" ||
    upper === "ADMIN" ||
    upper === "ROLE_ADMINISTRADOR" ||
    upper === "ROLE_ADMIN" ||
    upper.includes("ADMIN")
  );
};

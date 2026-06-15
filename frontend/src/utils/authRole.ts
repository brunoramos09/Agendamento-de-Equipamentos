export type UserRole = "ADMIN" | "USER";

const ROLE_KEY = "role";

export function setRole(role: UserRole) {
  localStorage.setItem(ROLE_KEY, role);
}

export function getRole(): UserRole {
  const role = localStorage.getItem(ROLE_KEY);

  if (role === "ADMIN") {
    return "ADMIN";
  }

  return "USER";
}

export function isAdmin() {
  return getRole() === "ADMIN";
}

export function logoutRole() {
  localStorage.removeItem(ROLE_KEY);
}

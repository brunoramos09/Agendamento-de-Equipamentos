export type UserRole = "ADMIN" | "USER";

export interface Usuario {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

const USER_KEY = "usuario";

export function setUsuario(usuario: Usuario) {
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
}

export function getUsuario(): Usuario | null {
  const usuario = localStorage.getItem(USER_KEY);

  if (!usuario) {
    return null;
  }

  try {
    return JSON.parse(usuario) as Usuario;
  } catch {
    return null;
  }
}

export function getRole(): UserRole {
  const usuario = getUsuario();

  if (usuario?.role === "ADMIN") {
    return "ADMIN";
  }

  return "USER";
}

export function isAdmin(): boolean {
  return getRole() === "ADMIN";
}

export function logoutRole() {
  localStorage.removeItem(USER_KEY);
}

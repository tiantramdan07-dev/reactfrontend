import { jwtDecode } from "jwt-decode";

export interface JwtUser {
  email: string;
  role: "admin" | "user";
  exp: number;
  iat: number;
}

/**
 * Ambil token dari localStorage atau sessionStorage
 */
export function getToken(): string | null {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

/**
 * Decode user dari JWT
 */
export function getUser(): JwtUser | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<JwtUser>(token);
  } catch {
    return null;
  }
}

/**
 * Cek user login atau belum
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Cek admin
 */
export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === "admin";
}

/**
 * Logout bersih
 */
export function logout() {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

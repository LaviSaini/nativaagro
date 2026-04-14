const TOKEN_KEY = "ecomapp_token";
const USER_KEY = "ecomapp_user";

export interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role?: string;
}

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function setAuthUser(user: AuthUser) {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(USER_KEY);
    return data ? (JSON.parse(data) as AuthUser) : null;
  }
  return null;
}

export function getAuthedUserId(): string | null {
  const u = getAuthUser();
  return u?._id || null;
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function isAdmin(): boolean {
  const user = getAuthUser();
  return user?.role === "admin";
}

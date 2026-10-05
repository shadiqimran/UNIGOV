export type AuthUser = {
  userId: number;
  name: string;
  email: string;
  role: "CITIZEN" | "DEPARTMENT_OFFICER" | "ADMIN";
};

const TOKEN_KEY = "unigov_token";
const USER_KEY = "unigov_user";

export function saveAuth(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getDashboardPath(role?: AuthUser["role"]) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "DEPARTMENT_OFFICER":
      return "/dashboard";
    case "CITIZEN":
    default:
      return "/dashboard";
  }
}

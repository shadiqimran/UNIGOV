const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type ApiOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, ...requestOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data as T;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export type AuditLog = {
  id: number;
  userId: number | null;
  applicationId: number | null;
  departmentId: number | null;
  departmentName: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  status: string;
  details: string | null;
  createdAt: string;
};

export async function getAuditLogs(token: string) {
  return apiFetch<AuditLog[]>("/api/admin/audit-logs", { token });
}

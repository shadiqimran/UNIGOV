import { apiFetch } from "@/lib/api";
import { AuthUser } from "@/lib/auth";

export type LoginResponse = {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: AuthUser["role"];
};

export type Service = {
  id: number;
  name: string;
  code: string;
  description: string;
  departmentId: number;
  departmentName: string;
  status: string;
};

export type Application = {
  id: number;
  applicationNumber: string;
  citizenId: number;
  serviceName: string;
  status: string;
  currentStepOrder: number;
  submittedAt: string | null;
  completedAt: string | null;
};

export type ApplicationCreateResponse = {
  applicationId: number;
  applicationNumber: string;
  serviceName: string;
  workflowName: string;
  status: string;
  currentStepOrder: number;
  message: string;
};

export type ApplicationStep = {
  id: number;
  stepOrder: number;
  stepName: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  retryCount: number;
};

export type Consent = {
  id: number;
  citizenId: number;
  departmentName: string;
  departmentCode: string;
  serviceId: number | null;
  serviceName: string | null;
  purpose: string;
  status: "GRANTED" | "REVOKED";
  grantedAt: string | null;
  revokedAt: string | null;
};

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

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/services");
}

export async function createApplication(
  serviceCode: string,
  token: string,
): Promise<ApplicationCreateResponse> {
  return apiFetch<ApplicationCreateResponse>("/api/applications", {
    method: "POST",
    token,
    body: JSON.stringify({ serviceCode }),
  });
}

export async function getApplications(
  token: string,
): Promise<Application[]> {
  return apiFetch<Application[]>("/api/applications", {
    token,
  });
}

export async function getApplication(
  applicationId: number,
  token: string,
): Promise<Application> {
  return apiFetch<Application>(`/api/applications/${applicationId}`, {
    token,
  });
}

export async function getApplicationSteps(
  applicationId: number,
  token: string,
): Promise<ApplicationStep[]> {
  return apiFetch<ApplicationStep[]>(
    `/api/applications/${applicationId}/steps`,
    { token },
  );
}

export async function executeWorkflow(
  applicationId: number,
  token: string,
) {
  return apiFetch<{
    applicationId: number;
    applicationNumber: string;
    status: string;
    currentStepOrder: number;
    message: string;
  }>(`/api/workflows/applications/${applicationId}/execute`, {
    method: "POST",
    token,
  });
}

export async function getConsents(token: string): Promise<Consent[]> {
  return apiFetch<Consent[]>("/api/citizen/consents", {
    token,
  });
}

export async function getActiveConsents(token: string): Promise<Consent[]> {
  return apiFetch<Consent[]>("/api/citizen/consents/active", {
    token,
  });
}

export async function grantConsent(
  departmentId: number,
  serviceId: number | null,
  purpose: string,
  token: string,
): Promise<Consent> {
  return apiFetch<Consent>("/api/citizen/consents", {
    method: "POST",
    token,
    body: JSON.stringify({
      departmentId,
      serviceId,
      purpose,
    }),
  });
}

export async function revokeConsent(
  consentId: number,
  token: string,
): Promise<Consent> {
  return apiFetch<Consent>(
    `/api/citizen/consents/${consentId}/revoke`,
    {
      method: "POST",
      token,
    },
  );
}

export async function getAuditLogs(token: string): Promise<AuditLog[]> {
  return apiFetch<AuditLog[]>("/api/admin/audit-logs", {
    token,
  });
}

export async function getIntegrationHealth(token: string) {
  return apiFetch<Record<string, unknown>>("/mock-gov/control", {
    token,
  });
}

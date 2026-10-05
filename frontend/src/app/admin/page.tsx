"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Application,
  AuditLog,
  getApplications,
  getAuditLogs,
  getIntegrationHealth,
} from "@/services/apiService";
import { getToken, getUser, logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [health, setHealth] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    try {
      setError("");

      const [apps, logs, integrationHealth] = await Promise.all([
        getApplications(token),
        getAuditLogs(token),
        getIntegrationHealth(token),
      ]);

      setApplications(apps);
      setAuditLogs(logs);
      setHealth(integrationHealth);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admin dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const completed = applications.filter(
      (a) => a.status === "COMPLETED",
    ).length;

    const failed = applications.filter(
      (a) => a.status === "FAILED",
    ).length;

    const active = applications.filter(
      (a) => !["COMPLETED", "FAILED"].includes(a.status),
    ).length;

    return {
      total: applications.length,
      active,
      completed,
      failed,
    };
  }, [applications]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <p className="text-sm text-slate-500">
          Loading admin dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">
              UG
            </div>
            <div>
              <div className="font-bold text-slate-900">UNIGOV</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Admin Console
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={loadDashboard}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Refresh
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            System administration
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            UNIGOV Control Center
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Monitor applications, interoperability services, workflow
            execution and system audit activity from one administrative view.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total applications" value={stats.total} />
          <StatCard label="In progress" value={stats.active} />
          <StatCard label="Completed" value={stats.completed} />
          <StatCard label="Failed" value={stats.failed} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="ug-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent applications
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Unified application activity across connected services.
                </p>
              </div>

              <Link
                href="/admin/applications"
                className="text-xs font-semibold text-blue-700 hover:text-blue-800"
              >
                View all →
              </Link>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400">
                    <th className="pb-3 font-medium">Application</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Step</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.slice(0, 6).map((application) => (
                    <tr
                      key={application.id}
                      className="border-b border-slate-50"
                    >
                      <td className="py-3 font-mono text-xs text-slate-600">
                        {application.applicationNumber}
                      </td>

                      <td className="py-3 text-slate-700">
                        {application.serviceName}
                      </td>

                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            application.status === "COMPLETED"
                              ? "ug-status-success"
                              : application.status === "FAILED"
                                ? "ug-status-danger"
                                : "ug-status-info"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>

                      <td className="py-3 text-slate-500">
                        {application.currentStepOrder}
                      </td>
                    </tr>
                  ))}

                  {applications.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-sm text-slate-400"
                      >
                        No applications yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="ug-card p-6">
            <div>
              <h2 className="font-semibold text-slate-900">
                Integration health
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Connected departmental API availability.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {["identity", "revenue", "education"].map((department) => {
                const online = health[department] === true;

                return (
                  <div
                    key={department}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize text-slate-800">
                        {department}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Government API adapter
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        online
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                );
              })}
            </div>

            <Link
              href="/admin/integrations"
              className="mt-5 block rounded-xl bg-slate-900 px-4 py-3 text-center text-xs font-semibold !text-white hover:bg-slate-800"
            >
              Integration controls
            </Link>
          </section>
        </div>

        <section className="ug-card mt-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent audit activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Immutable-style activity trail for administrative monitoring.
              </p>
            </div>

            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              View audit logs →
            </Link>
          </div>

          <div className="mt-5 space-y-2">
            {auditLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex flex-col gap-1 rounded-xl border border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {log.action}
                  </p>
                  <p className="text-xs text-slate-400">
                    {log.resourceType}
                    {log.resourceId ? ` #${log.resourceId}` : ""}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold ${
                    log.status === "SUCCESS"
                      ? "text-green-700"
                      : log.status === "FAILURE"
                        ? "text-red-700"
                        : "text-slate-500"
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}

            {auditLogs.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                No audit activity yet.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="ug-card p-5">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

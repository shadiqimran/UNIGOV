"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getAuditLogs, type AuditLog } from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  async function loadLogs() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin session not found.");
      }

      const data = await getAuditLogs(token);
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesStatus =
        statusFilter === "ALL" || log.status === statusFilter;

      const searchable = [
        log.action,
        log.resourceType,
        log.resourceId,
        log.details,
        log.departmentName,
        String(log.applicationId ?? ""),
        String(log.userId ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [logs, search, statusFilter]);

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <Link href="/admin" className="font-bold text-slate-900">
              UNIGOV
            </Link>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Admin Control Center
            </p>
          </div>

          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link
              href="/admin"
              className="text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/integrations"
              className="text-slate-600 hover:text-slate-900"
            >
              Integrations
            </Link>
            <span className="font-semibold text-blue-700">Audit Logs</span>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Security &amp; accountability
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Audit Logs
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Complete activity trail for applications, integrations,
              consent actions, and administrative operations.
            </p>
          </div>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh logs"}
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total events" value={logs.length} />
          <StatCard
            label="Successful"
            value={logs.filter((log) => log.status === "SUCCESS").length}
          />
          <StatCard
            label="Failures"
            value={logs.filter((log) => log.status === "FAILURE").length}
          />
        </section>

        <section className="ug-card mt-6 p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search action, application, department..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILURE">Failure</option>
              <option value="INFO">Info</option>
            </select>
          </div>
        </section>

        <section className="ug-card mt-6 overflow-hidden">
          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500">
              Loading audit logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-slate-800">
                No audit events found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                    <th className="px-5 py-3 font-semibold">Time</th>
                    <th className="px-5 py-3 font-semibold">Action</th>
                    <th className="px-5 py-3 font-semibold">Resource</th>
                    <th className="px-5 py-3 font-semibold">Application</th>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {formatDate(log.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {formatAction(log.action)}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          User #{log.userId ?? "system"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {log.resourceType}
                        </p>
                        {log.resourceId && (
                          <p className="mt-1 font-mono text-[11px] text-slate-400">
                            {log.resourceId}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-600">
                        {log.applicationId
                          ? `#${log.applicationId}`
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {log.departmentName || "System"}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={log.status} />
                      </td>

                      <td className="max-w-[280px] px-5 py-4 text-xs leading-5 text-slate-500">
                        {log.details || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {filteredLogs.length} of {logs.length} events
          </span>
          <Link
            href="/admin"
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="ug-card p-5">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "SUCCESS"
      ? "bg-green-50 text-green-700"
      : status === "FAILURE"
        ? "bg-red-50 text-red-700"
        : "bg-blue-50 text-blue-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {status}
    </span>
  );
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

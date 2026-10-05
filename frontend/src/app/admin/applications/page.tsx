"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getApplications, type Application } from "@/services/apiService";
import { getToken } from "@/lib/auth";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin session not found.");
      }

      const data = await getApplications(token);
      setApplications(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load applications.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const counts = useMemo(
    () => ({
      total: applications.length,
      submitted: applications.filter((a) => a.status === "SUBMITTED").length,
      progress: applications.filter((a) => a.status === "IN_PROGRESS").length,
      completed: applications.filter((a) => a.status === "COMPLETED").length,
      failed: applications.filter((a) => a.status === "FAILED").length,
    }),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "ALL" || application.status === statusFilter;

      const searchable = [
        application.applicationNumber,
        application.serviceName,
        String(application.citizenId),
        String(application.id),
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [applications, search, statusFilter]);

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
            <Link
              href="/admin/audit-logs"
              className="text-slate-600 hover:text-slate-900"
            >
              Audit Logs
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Application operations
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Applications
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Monitor citizen applications and their current position in the
              unified government workflow.
            </p>
          </div>

          <button
            onClick={loadApplications}
            disabled={loading}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold !text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh applications"}
          </button>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Total" value={counts.total} />
          <StatCard label="Submitted" value={counts.submitted} />
          <StatCard label="In progress" value={counts.progress} />
          <StatCard label="Completed" value={counts.completed} />
          <StatCard label="Failed" value={counts.failed} />
        </section>

        <section className="ug-card mt-6 p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search application number, service, citizen ID..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              <option value="ALL">All statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
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
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-slate-800">
                No applications found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing the search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                    <th className="px-5 py-3 font-semibold">Application</th>
                    <th className="px-5 py-3 font-semibold">Service</th>
                    <th className="px-5 py-3 font-semibold">Citizen</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Workflow step</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                    <th className="px-5 py-3 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredApplications.map((application) => (
                    <tr
                      key={application.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-semibold text-slate-700">
                          {application.applicationNumber}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          ID #{application.id}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {application.serviceName}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-600">
                        #{application.citizenId}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                            {application.currentStepOrder}
                          </span>
                          <span className="text-xs text-slate-500">
                            of 5
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                        {formatDate(application.submittedAt)}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/applications/${application.id}`}
                          className="inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View details
                        </Link>
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
            Showing {filteredApplications.length} of {applications.length}{" "}
            applications
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
    status === "COMPLETED"
      ? "bg-green-50 text-green-700"
      : status === "FAILED"
        ? "bg-red-50 text-red-700"
        : status === "IN_PROGRESS"
          ? "bg-amber-50 text-amber-700"
          : "bg-blue-50 text-blue-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

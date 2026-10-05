"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Application, getApplications } from "@/services/apiService";
import { getToken, getUser } from "@/lib/auth";

export default function MyApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    getApplications(token)
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-bold text-slate-900">
            UNIGOV
          </Link>

          <Link
            href="/applications"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white"
          >
            Apply for a service
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-semibold text-blue-700">
          Citizen portal
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          My Applications
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          View application status, verification progress and department
          processing history.
        </p>

        {loading ? (
          <div className="mt-10 text-center text-sm text-slate-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="ug-card mt-8 p-10 text-center">
            <h2 className="font-semibold text-slate-800">
              No applications yet
            </h2>
            <Link
              href="/applications"
              className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
            >
              Browse services
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {applications.map((application) => (
              <Link
                key={application.id}
                href={`/applications/${application.id}`}
                className="ug-card flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {application.serviceName}
                  </h2>

                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {application.applicationNumber}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Submitted{" "}
                    {application.submittedAt
                      ? new Date(application.submittedAt).toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "—"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      application.status === "COMPLETED"
                        ? "ug-status-success"
                        : application.status === "FAILED"
                          ? "ug-status-danger"
                          : "ug-status-info"
                    }`}
                  >
                    {application.status}
                  </span>

                  <span className="text-sm font-semibold text-blue-700">
                    Track →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

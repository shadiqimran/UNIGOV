"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Application,
  getApplications,
  getServices,
} from "@/services/apiService";
import { getToken, getUser, logout, AuthUser } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const currentUser = getUser();

    if (!token || !currentUser) {
      router.replace("/login");
      return;
    }

    setUser(currentUser);

    async function loadDashboard() {
      try {
        const [applicationData, services] = await Promise.all([
          getApplications(token!),
          getServices(),
        ]);

        setApplications(applicationData);
        setServiceCount(services.length);
      } catch (error) {
        console.error("Dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const completed = applications.filter(
    (application) => application.status === "COMPLETED",
  ).length;

  const pending = applications.filter(
    (application) =>
      application.status !== "COMPLETED" &&
      application.status !== "FAILED",
  ).length;

  const failed = applications.filter(
    (application) => application.status === "FAILED",
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">
              UG
            </div>
            <div>
              <div className="font-bold text-slate-900">UNIGOV</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Citizen Portal
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold text-slate-800">
                {user?.name || "Citizen"}
              </div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-blue-700">Citizen dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Welcome, {user?.name?.split(" ")[0] || "Citizen"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your government applications and track verification.
            </p>
          </div>

          <Link
            href="/applications"
            className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Apply for a service
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total applications", applications.length, "All submitted applications"],
            ["In progress", pending, "Currently being processed"],
            ["Completed", completed, "Successfully completed"],
            ["Failed", failed, "Need attention or retry"],
          ].map(([title, value, description]) => (
            <div key={String(title)} className="ug-card p-5">
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "—" : value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="ug-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Recent applications
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Latest application activity
                </p>
              </div>

              <Link
                href="/applications"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                View all
              </Link>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="font-medium text-slate-700">
                  No applications yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Start by applying for a government service.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((application) => (
                  <Link
                    key={application.id}
                    href={`/applications/${application.id}`}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {application.serviceName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {application.applicationNumber}
                      </p>
                    </div>

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
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="ug-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Available services
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "—" : serviceCount}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Connected government services
              </p>

              <Link
                href="/applications"
                className="mt-5 block rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Explore services
              </Link>
            </div>

            <div className="ug-card p-5">
              <p className="text-sm font-semibold text-slate-900">
                Privacy & consent
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review which departments have permission to use your data.
              </p>

              <Link
                href="/consents"
                className="mt-4 inline-block text-sm font-semibold text-blue-700"
              >
                Manage consent →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

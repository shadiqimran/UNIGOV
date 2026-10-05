"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getIntegrationHealth } from "@/services/apiService";
import { getToken, getUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const departments = [
  {
    key: "identity",
    name: "Identity Verification",
    description: "Citizen identity and authentication verification service.",
  },
  {
    key: "revenue",
    name: "Revenue / Income",
    description: "Income and revenue-record verification service.",
  },
  {
    key: "education",
    name: "Education",
    description: "Education and academic-record verification service.",
  },
];

export default function IntegrationControlsPage() {
  const router = useRouter();

  const [health, setHealth] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");

  async function loadHealth() {
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
      const data = await getIntegrationHealth(token);
      setHealth(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load integration status.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHealth();
  }, []);

  async function changeStatus(
    department: string,
    action: "offline" | "online",
  ) {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setBusy(department);
    setMessage("");

    try {
      const response = await fetch(
        `${API}/mock-gov/control/${department}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Request failed.");
      }

      setMessage(
        `${department.toUpperCase()} API is now ${
          action === "online" ? "ONLINE" : "OFFLINE"
        }.`,
      );

      await loadHealth();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to change integration status.",
      );
    } finally {
      setBusy("");
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <p className="text-sm text-slate-500">
          Loading integration controls...
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
                Integration Control
              </div>
            </div>
          </Link>

          <Link
            href="/admin"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Admin dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        <p className="text-sm font-semibold text-blue-700">
          Interoperability monitoring
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Integration Controls
        </h1>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Simulate availability changes in connected departmental APIs and
          demonstrate UNIGOV&apos;s failure handling and workflow recovery.
        </p>

        {message && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {departments.map((department) => {
            const online = health[department.key] === true;
            const isBusy = busy === department.key;

            return (
              <article
                key={department.key}
                className="ug-card p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {department.name}
                      </h2>

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

                    <p className="mt-2 text-sm text-slate-500">
                      {department.description}
                    </p>

                    <p className="mt-2 font-mono text-xs text-slate-400">
                      adapter: {department.key}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() =>
                        changeStatus(department.key, "offline")
                      }
                      disabled={!online || isBusy}
                      className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isBusy ? "Updating..." : "Take offline"}
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(department.key, "online")
                      }
                      disabled={online || isBusy}
                      className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Bring online
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <section className="ug-card mt-8 border-blue-100 bg-blue-50/50 p-6">
          <h2 className="font-semibold text-slate-900">
            Demo scenario
          </h2>

          <ol className="mt-3 space-y-2 text-sm text-slate-600">
            <li>
              <span className="font-semibold">1.</span> Take Revenue API
              offline.
            </li>
            <li>
              <span className="font-semibold">2.</span> Execute a scholarship
              application workflow.
            </li>
            <li>
              <span className="font-semibold">3.</span> UNIGOV retries the
              failed integration automatically.
            </li>
            <li>
              <span className="font-semibold">4.</span> Bring Revenue API
              online.
            </li>
            <li>
              <span className="font-semibold">5.</span> Re-execute the
              application and show checkpoint-based recovery.
            </li>
          </ol>
        </section>
      </section>
    </main>
  );
}

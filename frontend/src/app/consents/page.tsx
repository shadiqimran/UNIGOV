"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getConsents,
  getServices,
  grantConsent,
  revokeConsent,
  type Consent,
  type Service,
} from "@/services/apiService";
import { getToken, getUser } from "@/lib/auth";

const departments = [
  {
    id: 1,
    name: "Identity Verification Department",
    code: "IDN",
    description: "Identity verification",
  },
  {
    id: 2,
    name: "Revenue Department",
    code: "REV",
    description: "Income and revenue verification",
  },
  {
    id: 3,
    name: "Education Department",
    code: "EDU",
    description: "Education verification",
  },
  {
    id: 4,
    name: "Scholarship Department",
    code: "SCH",
    description: "Scholarship processing",
  },
];

export default function ConsentsPage() {
  const [consents, setConsents] = useState<Consent[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [revoking, setRevoking] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [departmentId, setDepartmentId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [purpose, setPurpose] = useState("");

  const user = getUser();

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      const [consentData, serviceData] = await Promise.all([
        getConsents(token),
        getServices(),
      ]);

      setConsents(consentData);
      setServices(serviceData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load consent data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleGrant(event: React.FormEvent) {
    event.preventDefault();

    if (!departmentId || !purpose.trim()) {
      setError("Select a department and enter the purpose.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      await grantConsent(
        Number(departmentId),
        serviceId ? Number(serviceId) : null,
        purpose.trim(),
        token,
      );

      setPurpose("");
      setServiceId("");
      setDepartmentId("");
      setMessage("Consent granted successfully.");

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to grant consent.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this consent?",
    );

    if (!confirmed) return;

    try {
      setRevoking(id);
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        throw new Error("Please log in again.");
      }

      await revokeConsent(id, token);

      setMessage("Consent revoked successfully.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to revoke consent.",
      );
    } finally {
      setRevoking(null);
    }
  }

  const selectedDepartment = departments.find(
    (department) => department.id === Number(departmentId),
  );

  const departmentServices = services.filter(
    (service) => service.departmentId === Number(departmentId),
  );

  const activeCount = consents.filter(
    (consent) => consent.status === "GRANTED",
  ).length;

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <Link href="/dashboard" className="font-bold text-slate-900">
              UNIGOV
            </Link>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Citizen Portal
            </p>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link
              href="/dashboard"
              className="font-medium text-slate-600 hover:text-slate-900"
            >
              Dashboard
            </Link>
            <Link
              href="/applications"
              className="font-medium text-slate-600 hover:text-slate-900"
            >
              Services
            </Link>
            <span className="font-semibold text-blue-700">Consent</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Citizen data control
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Consent Management
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Control which government departments can access your information
            for a specific service or purpose.
          </p>
          {user && (
            <p className="mt-2 text-xs text-slate-400">
              Signed in as {user.email}
            </p>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="ug-card p-6">
            <h2 className="font-semibold text-slate-900">
              Grant new consent
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Authorize a department to use your information for a defined
              purpose.
            </p>

            <form onSubmit={handleGrant} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department
                </label>
                <select
                  value={departmentId}
                  onChange={(event) => {
                    setDepartmentId(event.target.value);
                    setServiceId("");
                  }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Service <span className="text-slate-400">(optional)</span>
                </label>
                <select
                  value={serviceId}
                  onChange={(event) => setServiceId(event.target.value)}
                  disabled={!departmentId}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">All services / general access</option>
                  {departmentServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Purpose
                </label>
                <textarea
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  placeholder="Example: Verify my income for scholarship eligibility"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {selectedDepartment && (
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Authorization
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedDepartment.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDepartment.description}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold !text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Granting..." : "Grant consent"}
              </button>
            </form>
          </section>

          <section className="ug-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Your consent records
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {activeCount} active authorization
                  {activeCount === 1 ? "" : "s"}
                </p>
              </div>

              <button
                onClick={loadData}
                disabled={loading}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                Loading consent records...
              </div>
            ) : consents.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="font-semibold text-slate-800">
                  No consent records
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Grant consent when a government service needs authorized
                  access to your information.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {consents.map((consent) => (
                  <article key={consent.id} className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {consent.departmentName}
                          </h3>

                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            {consent.departmentCode}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              consent.status === "GRANTED"
                                ? "bg-green-50 text-green-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {consent.status}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          {consent.serviceName || "General department access"}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {consent.purpose}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-400">
                          {consent.grantedAt && (
                            <span>
                              Granted: {formatDate(consent.grantedAt)}
                            </span>
                          )}
                          {consent.revokedAt && (
                            <span>
                              Revoked: {formatDate(consent.revokedAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {consent.status === "GRANTED" && (
                        <button
                          onClick={() => handleRevoke(consent.id)}
                          disabled={revoking === consent.id}
                          className="shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {revoking === consent.id
                            ? "Revoking..."
                            : "Revoke consent"}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createApplication,
  getServices,
  Service,
} from "@/services/apiService";
import { getToken, getUser } from "@/lib/auth";

export default function ApplicationsPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Service | null>(null);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    getServices()
      .then(setServices)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load available services.",
        ),
      )
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit() {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!selected) {
      setError("Please select a service.");
      return;
    }

    if (!consent) {
      setError("Please provide consent to process your application data.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const application = await createApplication(selected.code, token);
      router.push(`/applications/${application.applicationId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit the application.",
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
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

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm font-semibold text-blue-700">
          Government services
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-950">
          Apply for a service
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Choose a service and submit one application. UNIGOV coordinates
          verification across connected departments.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-center text-sm text-slate-500">
            Loading services...
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelected(service);
                    setError("");
                  }}
                  className={`ug-card text-left p-5 transition ${
                    selected?.id === service.id
                      ? "ring-2 ring-blue-600"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                      {service.code.slice(0, 2)}
                    </div>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      ACTIVE
                    </span>
                  </div>

                  <h2 className="mt-5 font-semibold text-slate-900">
                    {service.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <p className="mt-4 text-xs text-slate-400">
                    {service.departmentName}
                  </p>
                </button>
              ))}
            </div>

            {selected && (
              <div className="ug-card mt-8 p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Application review
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {selected.name}
                </h2>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">
                    What happens after submission?
                  </p>

                  <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-4">
                    <div>1. Application submitted</div>
                    <div>2. Identity verification</div>
                    <div>3. Department verification</div>
                    <div>4. Review & decision</div>
                  </div>
                </div>

                <label className="mt-6 flex cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />

                  <span className="text-sm leading-6 text-slate-600">
                    I consent to UNIGOV sharing the required application
                    information with connected government departments for
                    verification and service processing.
                  </span>
                </label>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting
                      ? "Submitting application..."
                      : "Submit application"}
                  </button>

                  <button
                    onClick={() => {
                      setSelected(null);
                      setConsent(false);
                    }}
                    className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Change service
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

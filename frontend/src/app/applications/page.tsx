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
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    async function loadServices() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load available services.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, [router]);

  async function handleApply(serviceCode: string) {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setApplying(serviceCode);
    setError("");

    try {
      const application = await createApplication(serviceCode, token);
      router.push(`/applications/${application.applicationId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the application.",
      );
    } finally {
      setApplying(null);
    }
  }

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

          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Government services
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Apply for a service
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Select a connected service. UNIGOV will coordinate the required
            departmental verification steps through its interoperability layer.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-center text-sm text-slate-500">
            Loading available services...
          </div>
        ) : services.length === 0 ? (
          <div className="ug-card mt-10 p-10 text-center">
            <h2 className="font-semibold text-slate-800">
              No services available
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              There are currently no active services in the catalog.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.id}
                className="ug-card ug-card-hover flex flex-col p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                    {service.code.slice(0, 2)}
                  </div>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {service.status}
                  </span>
                </div>

                <h2 className="mt-6 text-lg font-semibold text-slate-900">
                  {service.name}
                </h2>

                <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
                  {service.description}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs text-slate-400">
                    Department
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {service.departmentName}
                  </p>
                </div>

                <button
                  onClick={() => handleApply(service.code)}
                  disabled={applying === service.code}
                  className="mt-5 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {applying === service.code
                    ? "Creating application..."
                    : "Apply now"}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Application,
  ApplicationStep,
  executeWorkflow,
  getApplication,
  getApplicationSteps,
} from "@/services/apiService";
import { getToken, getUser } from "@/lib/auth";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = Number(params.id);

  const [application, setApplication] = useState<Application | null>(null);
  const [steps, setSteps] = useState<ApplicationStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadApplication() {
    const token = getToken();
    const user = getUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    try {
      if (!Number.isFinite(applicationId)) {
        setMessage("Invalid application ID.");
        return;
      }

      const found = await getApplication(applicationId, token);
      setApplication(found);

      const stepData = await getApplicationSteps(
        applicationId,
        token,
      );

      setSteps(stepData);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to load application.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  async function handleExecute() {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setExecuting(true);
    setMessage("");

    try {
      const result = await executeWorkflow(applicationId, token);
      setMessage(result.message);
      await loadApplication();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Workflow execution failed.",
      );
    } finally {
      setExecuting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <p className="text-sm text-slate-500">
          Loading application...
        </p>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-6 py-12">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Application unavailable
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {message || "We could not find this application."}
          </p>
          <Link
            href="/applications"
            className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Back to services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="font-bold text-slate-900"
          >
            UNIGOV
          </Link>

          <Link
            href="/applications"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Services
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Application tracking
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              {application.serviceName}
            </h1>

            <p className="mt-2 font-mono text-sm text-slate-500">
              {application.applicationNumber}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              application.status === "COMPLETED"
                ? "ug-status-success"
                : application.status === "FAILED"
                  ? "ug-status-danger"
                  : "ug-status-info"
            }`}
          >
            {application.status}
          </span>
        </div>

        {message && (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        <div className="mt-8 ug-card p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Verification workflow
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Each step is processed through the UNIGOV orchestration layer.
              </p>
            </div>

            {application.status !== "COMPLETED" && (
              <button
                onClick={handleExecute}
                disabled={executing}
                className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {executing ? "Processing..." : "Run verification"}
              </button>
            )}
          </div>

          <div className="mt-8">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex gap-4">
                {index < steps.length - 1 && (
                  <div className="absolute left-4 top-9 h-[calc(100%-8px)] w-px bg-slate-200" />
                )}

                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : step.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : step.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {step.status === "COMPLETED"
                    ? "✓"
                    : step.status === "FAILED"
                      ? "!"
                      : step.stepOrder}
                </div>

                <div className="pb-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      {step.stepName}
                    </h3>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {step.status}
                    </span>
                  </div>

                  {step.errorMessage && (
                    <p className="mt-2 max-w-xl text-xs leading-5 text-red-600">
                      {step.errorMessage}
                    </p>
                  )}

                  {step.retryCount > 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      Retried {step.retryCount} time
                      {step.retryCount === 1 ? "" : "s"}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="ug-card p-5">
            <p className="text-xs text-slate-500">Current step</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {application.currentStepOrder}
            </p>
          </div>

          <div className="ug-card p-5">
            <p className="text-xs text-slate-500">Application ID</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              #{application.id}
            </p>
          </div>

          <div className="ug-card p-5">
            <p className="text-xs text-slate-500">Last updated</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {formatDate(
                application.completedAt ?? application.submittedAt
              )}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

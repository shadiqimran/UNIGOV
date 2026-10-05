"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/apiService";
import { getDashboardPath, saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);

      saveAuth(response.token, {
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      });

      router.push(getDashboardPath(response.role));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          <section className="hidden bg-blue-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold text-blue-700">
                  UG
                </div>
                <div>
                  <div className="text-xl font-bold">UNIGOV</div>
                  <div className="text-xs text-blue-100">
                    Unified Government Services
                  </div>
                </div>
              </Link>

              <div className="mt-24 max-w-md">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-200">
                  One connected layer
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight">
                  Access connected government services from one place.
                </h1>

                <p className="mt-6 text-base leading-7 text-blue-100">
                  Submit applications once, follow every verification step and
                  keep control of your consent.
                </p>
              </div>
            </div>

            <p className="text-sm text-blue-200">
              UNIGOV • SIH 2026 Prototype
            </p>
          </section>

          <section className="p-8 sm:p-12">
            <div className="mx-auto max-w-md">
              <Link
                href="/"
                className="text-sm font-medium text-slate-500 hover:text-slate-800"
              >
                ← Back to home
              </Link>

              <div className="mt-10">
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to access your UNIGOV services.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>

                    <span className="text-xs text-slate-400">
                      Demo environment
                    </span>
                  </div>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6">
                <p className="text-center text-sm text-slate-500">
                  New to UNIGOV?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Create a citizen account
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

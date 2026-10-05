import Link from "next/link";

const features = [
  {
    title: "One Application",
    description:
      "Citizens submit information once while connected departments handle verification behind the scenes.",
  },
  {
    title: "Interoperable Systems",
    description:
      "Adapters connect different departmental systems through a common data and integration layer.",
  },
  {
    title: "Unified Tracking",
    description:
      "Track every verification step, department handoff, retry and final decision from one place.",
  },
  {
    title: "Consent & Audit",
    description:
      "Citizen consent and system actions are recorded with an auditable history.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white">
              UG
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-slate-900">
                UNIGOV
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Unified Government Services
              </div>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20 lg:px-8 lg:pt-28">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Government interoperability platform
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Government services,
            <span className="block text-blue-700">
              connected through one layer.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            UNIGOV connects fragmented departmental systems, coordinates
            verification workflows and gives citizens a unified view of their
            applications.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="rounded-xl bg-blue-700 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              Access UNIGOV
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Create citizen account
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="ug-card ug-card-hover p-6"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                ✓
              </div>

              <h2 className="text-base font-semibold text-slate-900">
                {feature.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                Prototype architecture
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Citizen → UNIGOV → Departments
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                A middleware-style architecture orchestrates identity, income
                and education verification while maintaining consent, audit
                trails and workflow state.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 px-5 py-4 text-sm">
              <div className="font-semibold text-slate-800">
                Demo environment
              </div>
              <div className="mt-1 text-slate-500">
                Department APIs are simulated for this prototype.
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>UNIGOV — Interoperability & Workflow Orchestration</span>
          <span>Prototype • SIH 2026</span>
        </div>
      </footer>
    </main>
  );
}

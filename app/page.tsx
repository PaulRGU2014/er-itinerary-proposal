import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="w-full max-w-2xl px-8 py-16 text-center">
        <div className="mb-8">
          <div className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-800">
            Exclusive Resorts
          </div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900">
            Itinerary Proposal System
          </h1>
          <p className="text-xl text-slate-600">
            Curate luxury travel experiences for exclusive members
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-lg gap-4">
          <Link
            href="/concierge"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
          >
            Concierge Dashboard →
          </Link>
          <Link
            href="/proposals/1"
            className="rounded-2xl border-2 border-slate-300 bg-white px-8 py-5 text-lg font-bold text-slate-900 shadow-md transition-all hover:border-slate-400 hover:shadow-lg"
          >
            View Sample Proposal
          </Link>
        </div>

        <div className="mt-16 space-y-4 text-sm text-slate-600">
          <p>
            Built with Next.js 14, TypeScript, Tailwind CSS, and SQLite
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              GitHub
            </a>
            <span className="text-slate-400">•</span>
            <a
              href="/api/proposals"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 hover:text-blue-600"
            >
              API Docs
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

export default function ErrorPage({ error, reset }) {
  return (
    <main className="flex min-h-[65vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
          !
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          We couldn't load this page. Please try again.
        </p>
        {error?.digest && (
          <p className="mt-2 text-xs text-slate-400">Reference: {error.digest}</p>
        )}
        <button
          onClick={() => reset()}
          className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}

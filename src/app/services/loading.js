export default function Loading() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-7xl px-5 py-12">
      <div className="mb-8 h-8 w-56 animate-pulse rounded-lg bg-slate-200" />
      <div className="mb-8 h-4 w-80 max-w-full animate-pulse rounded bg-slate-100" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="mb-4 h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mb-3 h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="mb-6 h-4 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">Loading FixMate...</p>
    </main>
  );
}

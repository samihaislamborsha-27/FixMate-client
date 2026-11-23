import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-700">!</div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Payment cancelled</h1>
        <p className="mt-3 text-slate-600">No payment was confirmed. You can return to your bookings and try again when you're ready.</p>
        <Link href="/bookings" className="mt-6 inline-block rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">Return to bookings</Link>
      </div>
    </main>
  );
}

import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">✓</div>
        <h1 className="mt-5 text-2xl font-bold text-slate-900">Checkout completed</h1>
        <p className="mt-3 text-slate-600">Stripe has returned you to FixMate. Your payment will show as paid after our server verifies the payment notification.</p>
        <p className="mt-2 text-sm text-slate-500">Please allow a few moments for the webhook to update your booking.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/bookings" className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white">View my bookings</Link>
          <Link href="/payment/history" className="rounded-lg border px-5 py-3 font-semibold text-slate-700">Payment history</Link>
        </div>
      </div>
    </main>
  );
}

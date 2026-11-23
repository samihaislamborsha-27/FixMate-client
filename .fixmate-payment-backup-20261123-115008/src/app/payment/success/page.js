import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="max-w-lg rounded-2xl bg-white p-9 text-center shadow">
        <div className="text-5xl">✓</div>
        <h1 className="mt-4 text-3xl font-bold">Payment submitted</h1>
        <p className="mt-3 text-slate-600">
          Stripe has returned you to FixMate. Your payment status will update after our secure webhook verifies the transaction.
        </p>
        <Link href="/payments" className="mt-7 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white">
          View Payment History
        </Link>
      </section>
    </main>
  );
}

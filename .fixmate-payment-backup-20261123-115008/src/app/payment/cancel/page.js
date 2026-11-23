import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="max-w-lg rounded-2xl bg-white p-9 text-center shadow">
        <h1 className="text-3xl font-bold">Payment cancelled</h1>
        <p className="mt-3 text-slate-600">
          Your payment was not completed. You can return to your bookings and try again later.
        </p>
        <Link href="/bookings" className="mt-7 inline-block rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white">
          Back to Bookings
        </Link>
      </section>
    </main>
  );
}

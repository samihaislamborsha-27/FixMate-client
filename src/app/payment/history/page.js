"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function PaymentHistoryPage() {
  const { data: session, isPending } = authClient.useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      window.location.href = "/login";
      return;
    }

    apiRequest("/api/payments/history", { auth: true })
      .then((result) => {
        const list = result.data?.payments || result.data || result.payments || [];
        setPayments(Array.isArray(list) ? list : []);
      })
      .catch((err) => setError(err.message || "Could not load payment history."))
      .finally(() => setLoading(false));
  }, [session, isPending]);

  if (isPending || loading) return <main className="p-10 text-center">Loading payment history...</main>;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/bookings" className="text-sm font-semibold text-blue-700">← Back to bookings</Link>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Payment History</h1>
        <p className="mt-2 text-slate-600">Your FixMate payment records.</p>

        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

        {!payments.length && !error ? (
          <div className="mt-7 rounded-xl border bg-white p-8 text-center">
            <h2 className="font-semibold">No payments yet</h2>
            <p className="mt-2 text-sm text-slate-500">Completed payments will appear here.</p>
          </div>
        ) : (
          <div className="mt-7 grid gap-3">
            {payments.map((payment, index) => (
              <article key={payment._id || payment.id || payment.stripeSessionId || index} className="rounded-xl border bg-white p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">{payment.serviceTitle || payment.description || "FixMate repair service"}</h2>
                  <span className="font-semibold text-green-700">{payment.status || payment.paymentStatus || "paid"}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">Amount: {payment.amount ?? payment.price ?? "Not available"} {payment.currency || ""}</p>
                <p className="mt-1 break-all text-xs text-slate-400">Payment ID: {payment._id || payment.stripeSessionId || "—"}</p>
                {payment.createdAt && <p className="mt-1 text-xs text-slate-500">{new Date(payment.createdAt).toLocaleString()}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

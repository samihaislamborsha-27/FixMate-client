"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPayments() {
    try {
      setLoading(true);
      const result = await apiRequest("/api/payments/history", { auth: true });
      setPayments(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load payments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPayments(); }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-blue-700">← Dashboard</Link>
        <h1 className="mt-5 text-3xl font-bold">Payment History</h1>

        {loading && <p className="mt-6">Loading payment history...</p>}
        {error && <p className="mt-6 text-red-600">{error}</p>}

        {!loading && !error && payments.length === 0 && (
          <div className="mt-6 rounded-xl bg-white p-8 text-slate-600 shadow">
            No payments found yet.
          </div>
        )}

        <div className="mt-6 space-y-4">
          {payments.map((payment) => (
            <article key={payment._id} className="rounded-xl bg-white p-6 shadow">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">Booking: {String(payment.bookingId)}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : ""}
                  </p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {payment.status}
                </span>
              </div>
              <p className="mt-3 text-xl font-bold">
                {payment.currency?.toUpperCase()} {payment.amount}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

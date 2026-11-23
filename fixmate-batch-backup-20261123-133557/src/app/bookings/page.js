"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function BookingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState("");

  const loadBookings = useCallback(async () => {
    try {
      setError("");
      const result = await apiRequest("/api/bookings/my-bookings", { auth: true });
      const list = result.data?.bookings || result.data || result.bookings || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      window.location.href = "/login";
      return;
    }
    loadBookings();
  }, [session, isPending, loadBookings]);

  async function cancelBooking(id) {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setWorking(id);
      await apiRequest(`/api/bookings/${id}/cancel`, {
        method: "PATCH",
        auth: true
      });
      await loadBookings();
    } catch (err) {
      setError(err.message || "Cancellation failed.");
    } finally {
      setWorking("");
    }
  }

  async function payNow(booking) {
    try {
      setWorking(booking._id);
      setError("");

      const result = await apiRequest(
        `/api/payments/checkout/${booking._id}`,
        { method: "POST", auth: true }
      );

      const checkoutUrl =
        result.url ||
        result.checkoutUrl ||
        result.data?.url ||
        result.data?.checkoutUrl ||
        result.data?.session?.url ||
        result.session?.url;

      if (!checkoutUrl) {
        throw new Error(result.message || "Stripe checkout URL was not returned. Check the payment API response.");
      }

      window.location.assign(checkoutUrl);
    } catch (err) {
      setError(err.message || "Unable to start payment.");
      setWorking("");
    }
  }

  if (isPending || loading) {
    return <main className="p-10 text-center">Loading your bookings...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Bookings</h1>
            <p className="mt-2 text-slate-600">Track your repair requests and payments.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/payment/history" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700">Payment History</Link>
            <Link href="/services" className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white">Browse Services</Link>
          </div>
        </div>

        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {!bookings.length && !error ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-semibold">No bookings yet</h2>
            <p className="mt-2 text-slate-500">Choose a repair service to make your first booking.</p>
            <Link href="/services" className="mt-5 inline-block font-semibold text-blue-700">Explore services →</Link>
          </div>
        ) : (
          <div className="mt-7 grid gap-4">
            {bookings.map((booking) => {
              const completed = booking.status === "completed";
              const paid = booking.paymentStatus === "paid";
              const canPay = completed && !paid;

              return (
                <article key={booking._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{booking.serviceTitle}</h2>
                      <p className="mt-1 break-all text-sm text-slate-500">Booking ID: {booking._id}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                      {(booking.status || "requested").replace("-", " ")}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p><strong>Preferred date:</strong> {booking.preferredDate}</p>
                    <p><strong>Area:</strong> {booking.area}</p>
                    <p><strong>Price:</strong> {booking.price ?? "Not specified"}</p>
                    <p><strong>Payment:</strong> <span className={paid ? "font-semibold text-green-700" : "font-semibold text-amber-700"}>{booking.paymentStatus || "unpaid"}</span></p>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{booking.problemDescription}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {canPay && (
                      <button
                        onClick={() => payNow(booking)}
                        disabled={working === booking._id}
                        className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-50"
                      >
                        {working === booking._id ? "Connecting to Stripe..." : "Pay Now"}
                      </button>
                    )}

                    {paid && (
                      <span className="rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
                        Payment completed
                      </span>
                    )}

                    {booking.status === "requested" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        disabled={working === booking._id}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        {working === booking._id ? "Please wait..." : "Cancel booking"}
                      </button>
                    )}
                  </div>

                  {completed && !paid && (
                    <p className="mt-3 text-xs text-slate-500">Your job is complete. You can now pay securely through Stripe.</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

const nextAction = {
  requested: [
    { status: "accepted", label: "Accept booking", style: "bg-emerald-600 hover:bg-emerald-700" },
    { status: "rejected", label: "Reject", style: "bg-rose-600 hover:bg-rose-700" },
  ],
  accepted: [
    { status: "in-progress", label: "Start work", style: "bg-blue-700 hover:bg-blue-800" },
  ],
  "in-progress": [
    { status: "completed", label: "Mark completed", style: "bg-emerald-600 hover:bg-emerald-700" },
  ],
};

function formatDate(value) {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function money(value) {
  const amount = Number(value);
  return `৳${Number.isFinite(amount) ? amount.toLocaleString("en-BD") : "0"}`;
}

function getArray(result) {
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.bookings)) return result.data.bookings;
  if (Array.isArray(result?.data?.services)) return result.data.services;
  return [];
}

export default function TechnicianPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [bookingResult, serviceResult] = await Promise.all([
        apiRequest("/api/bookings/technician", { auth: true }),
        apiRequest("/api/services/my-services", { auth: true }),
      ]);
      setBookings(getArray(bookingResult));
      setServices(getArray(serviceResult));
    } catch (err) {
      setError(err.message || "Could not load your technician dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user?.role !== "technician") {
      router.replace("/dashboard");
      return;
    }
    loadDashboard();
  }, [session, isPending, router, loadDashboard]);

  async function updateStatus(bookingId, status) {
    setBusyId(bookingId);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });
      setNotice(result.message || "Booking status updated.");
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not update booking status.");
    } finally {
      setBusyId("");
    }
  }

  if (isPending || !session || session.user?.role !== "technician") {
    return <main className="min-h-screen bg-slate-50 p-10 text-center text-slate-600">Checking technician access...</main>;
  }

  const counts = {
    requested: bookings.filter((item) => item.status === "requested").length,
    active: bookings.filter((item) => ["accepted", "in-progress"].includes(item.status)).length,
    completed: bookings.filter((item) => item.status === "completed").length,
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-2xl font-black text-blue-700">FixMate.</Link>
            <p className="mt-2 text-sm text-slate-500">Technician workspace</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome, {session.user?.name || "Technician"}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/technician/services/new" className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">+ Add a service</Link>
            <Link href="/services" className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">Explore services</Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100">My account</Link>
          </div>
        </header>

        {error && <div role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
        {notice && <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{notice}</div>}

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["New requests", counts.requested],
            ["Active jobs", counts.active],
            ["Completed jobs", counts.completed],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-bold">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Booking requests and jobs</h2>
              <p className="mt-1 text-sm text-slate-500">Review requests and update each job as you work.</p>
            </div>
            <button onClick={loadDashboard} disabled={loading} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-white p-8 text-center text-slate-500">Loading your bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="font-semibold">No bookings yet</p>
              <p className="mt-1 text-sm text-slate-500">New customer requests will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <article key={booking._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{booking.serviceTitle || "Repair service"}</h3>
                      <p className="mt-1 text-sm text-slate-500">Booking #{String(booking._id).slice(-8)}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-700">{String(booking.status || "unknown").replace("-", " ")}</span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <p><span className="font-semibold">Customer:</span> {booking.customerName || "Not provided"}</p>
                    <p><span className="font-semibold">Phone:</span> {booking.phone || "Not provided"}</p>
                    <p><span className="font-semibold">Price:</span> {money(booking.price)}</p>
                    <p><span className="font-semibold">Area:</span> {booking.area || "Not provided"}</p>
                    <p><span className="font-semibold">Preferred date:</span> {formatDate(booking.preferredDate)}</p>
                    <p><span className="font-semibold">Payment:</span> {booking.paymentStatus || "unpaid"}</p>
                    <p className="sm:col-span-2 lg:col-span-3"><span className="font-semibold">Address:</span> {booking.address || "Not provided"}</p>
                    <p className="sm:col-span-2 lg:col-span-3"><span className="font-semibold">Problem:</span> {booking.problemDescription || "No description provided"}</p>
                  </div>

                  {nextAction[booking.status] && (
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                      {nextAction[booking.status].map((action) => (
                        <button
                          key={action.status}
                          onClick={() => updateStatus(booking._id, action.status)}
                          disabled={busyId === booking._id}
                          className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${action.style}`}
                        >
                          {busyId === booking._id ? "Updating..." : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold">My submitted services</h2>
          <p className="mt-1 text-sm text-slate-500">Track the approval status of services you have submitted.</p>
          {loading ? (
            <div className="mt-4 rounded-xl border bg-white p-6 text-center text-slate-500">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center">
              <p className="font-semibold">No services submitted yet</p>
              <Link href="/technician/services/new" className="mt-3 inline-block font-semibold text-blue-700 hover:underline">Add your first service</Link>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr><th className="px-4 py-3">Service</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Availability</th></tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold">{service.title || service.name || "Untitled service"}</td>
                      <td className="px-4 py-3">{money(service.price ?? service.cost)}</td>
                      <td className="px-4 py-3 capitalize">{service.status || "unknown"}</td>
                      <td className="px-4 py-3 capitalize">{service.availability || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

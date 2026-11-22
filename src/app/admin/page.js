"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState("");

  const loadServices = useCallback(async () => {
    try {
      setError("");

      const result = await apiRequest("/api/admin/services/pending", {
        auth: true
      });

      const records = result.data || [];
      setServices(Array.isArray(records) ? records : []);
    } catch (err) {
      setError(err.message || "Unable to load pending services.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    if (session.user.role !== "admin") {
      router.replace(
        session.user.role === "technician" ? "/technician" : "/dashboard"
      );
      return;
    }

    loadServices();
  }, [session, isPending, router, loadServices]);

  async function reviewService(id, status) {
    const action = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this service?`)) {
      return;
    }

    try {
      setWorking(id);
      setError("");

      await apiRequest(`/api/admin/services/${id}/review`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status })
      });

      setServices(current => current.filter(service => service._id !== id));
    } catch (err) {
      setError(err.message || `Unable to ${action} service.`);
    } finally {
      setWorking("");
    }
  }

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  if (isPending || loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50">
        <p className="font-medium text-slate-600">Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold tracking-wider text-blue-700">
              FIXMATE ADMINISTRATION
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Welcome, {session?.user?.name || "Administrator"}
            </p>
          </div>

          <button
            onClick={signOut}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Sign out
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Pending services</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {services.length}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Waiting for administrator review
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Approval system</p>
            <p className="mt-2 text-xl font-bold text-green-700">Active</p>
            <p className="mt-2 text-xs text-slate-500">
              Approve or reject technician submissions
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Administrator</p>
            <p className="mt-2 truncate text-lg font-bold text-slate-900">
              {session?.user?.email}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Authorized admin account
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Service approval requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review services submitted by technicians before publishing.
              </p>
            </div>

            <button
              onClick={loadServices}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
              <button onClick={loadServices} className="ml-3 font-bold underline">
                Try again
              </button>
            </div>
          )}

          {!services.length && !error ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-12 text-center">
              <div className="text-4xl">✓</div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                All caught up!
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                There are currently no services waiting for approval.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {services.map(service => (
                <article
                  key={service._id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {service.title || service.name || service.serviceName || "Untitled service"}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {service.category || "Uncategorized"}
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold capitalize text-amber-700">
                      {service.status || "pending"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Price</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {service.price ?? service.cost ?? "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Area</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {service.area || service.location || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Technician ID</p>
                      <p className="mt-1 break-all font-medium text-slate-800">
                        {String(service.technicianId || "Not available")}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">Submitted</p>
                      <p className="mt-1 font-medium text-slate-800">
                        {service.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Description
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {service.description || service.details || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      disabled={working === service._id}
                      onClick={() => reviewService(service._id, "approved")}
                      className="flex-1 rounded-lg bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50"
                    >
                      {working === service._id ? "Processing..." : "Approve"}
                    </button>

                    <button
                      disabled={working === service._id}
                      onClick={() => reviewService(service._id, "rejected")}
                      className="flex-1 rounded-lg border border-red-200 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          FixMate Administration Panel
        </footer>
      </div>
    </main>
  );
}

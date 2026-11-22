"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { ShieldCheck, RefreshCw, LogOut } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadPending() {
    setLoading(true);
    try {
      const result = await apiRequest("/api/admin/services/pending", { auth: true });
      setServices(result.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
    if (!isPending && session && session.user.role !== "admin") router.replace("/dashboard");
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") loadPending();
  }, [session]);

  async function reviewService(id, status) {
    try {
      const result = await apiRequest(`/api/admin/services/${id}/review`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      });
      toast.success(result.message);
      await loadPending();
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function logout() {
    await authClient.signOut();
    router.replace("/login");
  }

  if (isPending || !session || session.user.role !== "admin") {
    return <main className="p-10 text-center text-slate-600">Loading admin dashboard...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-black text-blue-700">FixMate.</Link>
          <button onClick={logout} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-red-600"><LogOut size={16} /> Logout</button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Administration</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Service Approval</h1>
            <p className="mt-2 text-slate-500">Review technician submissions before publishing.</p>
          </div>
          <button onClick={loadPending} className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold text-blue-700"><RefreshCw size={16} /> Refresh</button>
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3"><ShieldCheck className="text-blue-700" /><h2 className="text-xl font-bold">Pending submissions ({services.length})</h2></div>

          {loading ? <p className="py-12 text-center text-slate-500">Loading submissions...</p> :
            services.length === 0 ? <p className="py-12 text-center text-slate-500">No pending service submissions.</p> :
            <div className="mt-6 space-y-5">
              {services.map((service) => (
                <article key={service._id} className="rounded-xl border p-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{service.category} · {service.area}</p>
                      <p className="mt-1 text-sm text-slate-500">Technician: {service.technicianName}</p>
                    </div>
                    <span className="font-bold text-blue-700">৳{service.price}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{service.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button onClick={() => reviewService(service._id, "approved")} className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700">Approve</button>
                    <button onClick={() => reviewService(service._id, "rejected")} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700">Reject</button>
                  </div>
                </article>
              ))}
            </div>
          }
        </div>
      </section>
    </main>
  );
}

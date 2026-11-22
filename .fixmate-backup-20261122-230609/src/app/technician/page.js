"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Wrench, PlusCircle, LogOut, RefreshCw } from "lucide-react";

const initialForm = {
  title: "",
  category: "AC Repair",
  description: "",
  price: "",
  area: "",
};

export default function TechnicianPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState(initialForm);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  async function loadMyServices() {
    setListLoading(true);
    try {
      const result = await apiRequest("/api/services/my-services", { auth: true });
      setServices(result.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    if (!isPending && !session) router.replace("/login");
    if (!isPending && session && session.user.role !== "technician") router.replace("/dashboard");
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user?.role === "technician") loadMyServices();
  }, [session]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await apiRequest("/api/services", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      toast.success(result.message || "Service submitted for approval.");
      setForm(initialForm);
      await loadMyServices();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await authClient.signOut();
    router.replace("/login");
  }

  if (isPending || !session || session.user.role !== "technician") {
    return <main className="p-10 text-center text-slate-600">Loading technician workspace...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-5 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-2xl font-black text-blue-700">FixMate.</Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{session.user.name}</span>
            <button onClick={logout} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-red-600"><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Technician workspace</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900">Manage Your Services</h1>
        <p className="mt-2 text-slate-500">Submit repair services and track admin approval.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2"><PlusCircle className="text-blue-700" /><h2 className="text-xl font-bold">Add a Service</h2></div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Service title</label>
              <input required maxLength={100} value={form.title} onChange={(e) => setForm({...form,title:e.target.value})} className="w-full rounded-xl border p-3 text-sm" placeholder="e.g. Home AC servicing" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form,category:e.target.value})} className="w-full rounded-xl border p-3 text-sm">
                <option>AC Repair</option>
                <option>Refrigerator Repair</option>
                <option>Washing Machine</option>
                <option>Computer Repair</option>
                <option>Television Repair</option>
                <option>Microwave Repair</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Description</label>
              <textarea required maxLength={1500} rows={4} value={form.description} onChange={(e) => setForm({...form,description:e.target.value})} className="w-full rounded-xl border p-3 text-sm" placeholder="Describe your repair service..." />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Price (BDT)</label>
              <input required type="number" min="1" step="1" value={form.price} onChange={(e) => setForm({...form,price:e.target.value})} className="w-full rounded-xl border p-3 text-sm" placeholder="e.g. 1500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Service area</label>
              <input required value={form.area} onChange={(e) => setForm({...form,area:e.target.value})} className="w-full rounded-xl border p-3 text-sm" placeholder="e.g. Dhanmondi, Dhaka" />
            </div>

            <button disabled={loading} className="w-full rounded-xl bg-blue-700 py-3 font-bold text-white hover:bg-blue-800 disabled:opacity-60">
              {loading ? "Submitting..." : "Submit for Approval"}
            </button>
          </form>

          <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">My Submitted Services</h2>
              <button onClick={loadMyServices} className="flex items-center gap-2 text-sm font-semibold text-blue-700"><RefreshCw size={15} /> Refresh</button>
            </div>

            {listLoading ? <p className="py-10 text-center text-slate-500">Loading services...</p> :
              services.length === 0 ? <p className="py-12 text-center text-slate-500">You haven't submitted any services yet.</p> :
              <div className="mt-5 space-y-4">
                {services.map((service) => (
                  <article key={service._id} className="rounded-xl border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">{service.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{service.category} · ৳{service.price} · {service.area}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${service.status === "approved" ? "bg-green-100 text-green-700" : service.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{service.status}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{service.description}</p>
                  </article>
                ))}
              </div>
            }
          </section>
        </div>
      </section>
    </main>
  );
}

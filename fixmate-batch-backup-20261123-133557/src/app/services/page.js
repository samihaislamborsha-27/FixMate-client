"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Search, Wrench, MapPin, ArrowUpDown, RefreshCw } from "lucide-react";

export default function ServicesPage() {
  const { data: session } = authClient.useSession();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [area, setArea] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadServices() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);
      if (area.trim()) params.set("area", area.trim());
      params.set("sort", sort);

      const result = await apiRequest(`/api/services?${params.toString()}`);
      setServices(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, [search, category, area, sort]);

  return (
    <main className="min-h-screen bg-slate-50">

      <section className="bg-gradient-to-r from-blue-950 to-blue-700 px-5 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-300">Find a professional</p>
          <h1 className="mt-3 text-4xl font-black">Explore Repair Services</h1>
          <p className="mt-3 text-blue-100">Find available repair services from FixMate technicians.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-3 rounded-2xl border bg-white p-5 shadow-sm md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search services..." className="w-full rounded-xl border py-3 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500" />
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border px-3 py-3 text-sm text-slate-800">
            <option value="">All categories</option>
            <option value="AC Repair">AC Repair</option>
            <option value="Refrigerator Repair">Refrigerator Repair</option>
            <option value="Washing Machine">Washing Machine</option>
            <option value="Computer Repair">Computer Repair</option>
            <option value="Television Repair">Television Repair</option>
            <option value="Microwave Repair">Microwave Repair</option>
          </select>

          <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Filter by area" className="rounded-xl border px-3 py-3 text-sm text-slate-800 outline-none focus:border-blue-500" />

          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-xl border px-3 py-3 text-sm text-slate-800">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
          </select>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Available Services</h2>
          <button onClick={loadServices} className="flex items-center gap-2 text-sm font-semibold text-blue-700"><RefreshCw size={16} /> Refresh</button>
        </div>

        {loading ? (
          <p className="py-16 text-center text-slate-500">Loading services...</p>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>
        ) : services.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed bg-white p-12 text-center">
            <Wrench className="mx-auto text-slate-300" size={42} />
            <h3 className="mt-4 text-lg font-bold text-slate-800">No services found</h3>
            <p className="mt-2 text-sm text-slate-500">Try changing your search or filters. Approved services will appear here.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service._id} className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Wrench size={25} /></div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-700">{service.category}</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">{service.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{service.description}</p>
                <div className="mt-5 flex items-center justify-between border-t pt-4">
                  <span className="font-bold text-blue-800">৳ {Number(service.price).toLocaleString("en-BD")}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={14} /> {service.area}</span>
                </div>
                <p className="mt-3 text-xs text-slate-500">Technician: {service.technicianName}</p>
                {!session ? (
                  <Link href="/login?redirect=/services" className="mt-5 block rounded-xl bg-blue-700 py-3 text-center text-sm font-bold text-white hover:bg-blue-800">Sign in to Book</Link>
                ) : session.user?.role === "customer" ? (
                  <Link href={`/bookings/new?serviceId=${service._id}`} className="mt-5 block rounded-xl bg-blue-700 py-3 text-center text-sm font-bold text-white hover:bg-blue-800">Book This Service</Link>
                ) : (
                  <Link href={session.user?.role === "admin" ? "/admin" : "/technician"} className="mt-5 block rounded-xl border border-blue-200 py-3 text-center text-sm font-bold text-blue-700">Go to Dashboard</Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}



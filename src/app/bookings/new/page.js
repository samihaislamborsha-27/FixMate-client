"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function NewBookingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [serviceId, setServiceId] = useState("");
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    area: "",
    address: "",
    preferredDate: "",
    problemDescription: ""
  });

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("serviceId");
    if (id) setServiceId(id);
    else {
      setError("No service selected. Please choose a service first.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace("/login?redirect=/bookings/new");
      return;
    }
    if (session.user.role === "technician" || session.user.role === "admin") {
      router.replace(session.user.role === "admin" ? "/admin" : "/technician");
      return;
    }
    if (!serviceId) return;

    let alive = true;
    apiRequest(`/api/services/${serviceId}`)
      .then((result) => {
        if (!alive) return;
        const item = result.data?.service || result.data || result.service || result;
        setService(item);
      })
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [session, isPending, serviceId, router]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/bookings", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ ...form, serviceId })
      });
      router.push("/bookings");
    } catch (err) {
      setError(err.message || "Booking failed.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || loading) {
    return <main className="mx-auto max-w-3xl p-8 text-center">Loading booking form...</main>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/services" className="text-sm font-semibold text-blue-700">← Back to services</Link>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Book a Repair Service</h1>
          <p className="mt-2 text-sm text-slate-500">Provide your details so the technician can contact you.</p>

          {service && (
            <div className="mt-5 rounded-xl bg-blue-50 p-4">
              <p className="font-semibold text-slate-900">{service.title || service.name || service.serviceTitle || "Selected service"}</p>
              <p className="mt-1 text-sm text-slate-600">Price: {service.price ?? service.cost ?? "Contact for price"}</p>
            </div>
          )}

          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={submitBooking} className="mt-6 space-y-4">
            {[
              ["customerName", "Your full name", "text"],
              ["phone", "Phone number", "tel"],
              ["area", "Your area", "text"],
              ["address", "Full service address", "text"],
              ["preferredDate", "Preferred date", "date"]
            ].map(([name, label, type]) => (
              <div key={name}>
                <label htmlFor={name} className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  required
                  value={form[name]}
                  onChange={updateField}
                  min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                  className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}

            <div>
              <label htmlFor="problemDescription" className="mb-1 block text-sm font-medium text-slate-700">Describe the problem</label>
              <textarea
                id="problemDescription"
                name="problemDescription"
                required
                rows={4}
                value={form.problemDescription}
                onChange={updateField}
                placeholder="Describe your device or appliance issue..."
                className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button disabled={saving || !service} className="w-full rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">
              {saving ? "Submitting..." : "Submit Booking Request"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

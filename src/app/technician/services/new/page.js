"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function AddServicePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    area: "",
    price: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/api/services", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          ...form,
          price: Number(form.price)
        })
      });

      alert("Service submitted! It will appear publicly after admin approval.");
      router.push("/technician");
    } catch (err) {
      setError(err.message || "Could not submit your service.");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) return <main className="p-10">Loading...</main>;

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">
        <Link href="/technician" className="text-blue-700">← Back to dashboard</Link>
        <h1 className="mt-5 text-3xl font-bold">Add a Service</h1>
        <p className="mt-2 text-slate-600">
          Submit your repair service for administrator approval.
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <input name="title" required placeholder="Service title"
            value={form.title} onChange={update}
            className="w-full rounded-lg border p-3" />

          <input name="category" required placeholder="Category (e.g. AC Repair)"
            value={form.category} onChange={update}
            className="w-full rounded-lg border p-3" />

          <textarea name="description" required placeholder="Describe your service"
            value={form.description} onChange={update}
            className="w-full rounded-lg border p-3" rows={4} />

          <input name="area" required placeholder="Service area"
            value={form.area} onChange={update}
            className="w-full rounded-lg border p-3" />

          <input name="price" required type="number" min="1" placeholder="Price (BDT)"
            value={form.price} onChange={update}
            className="w-full rounded-lg border p-3" />

          {error && <p className="text-red-600">{error}</p>}

          <button disabled={loading} type="submit"
            className="w-full rounded-lg bg-blue-700 p-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Submitting..." : "Submit Service"}
          </button>
        </form>
      </div>
    </main>
  );
}

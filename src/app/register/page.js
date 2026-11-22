"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    area: "",
    role: "customer",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        area: form.area.trim(),
        role: form.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      if (data) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl space-y-5"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Join FixMate</h1>
          <p className="mt-2 text-slate-500">
            Create your account to get started.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Area</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="Your area or location"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Register as
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 text-slate-900"
          >
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
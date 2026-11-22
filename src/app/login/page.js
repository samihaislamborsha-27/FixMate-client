"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        toast.error(error.message || "Login failed.");
        return;
      }

      if (data) {
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mt-2 text-slate-500">Sign in to your FixMate account.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full rounded-lg border p-3 text-slate-900"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
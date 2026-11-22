"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  async function handleLogout() {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Logout failed.");
      return;
    }

    toast.success("Logged out successfully.");
    router.push("/login");
  }

  if (isPending) {
    return <div className="p-10 text-center">Loading account...</div>;
  }

  if (!session) {
    router.replace("/login");
    return <div className="p-10 text-center">Redirecting...</div>;
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">
          FixMate Dashboard
        </h1>

        <div className="mt-6 space-y-3 text-slate-700">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          <p><strong>Area:</strong> {user.area || "Not provided"}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
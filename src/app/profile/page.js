"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Camera, UserRound } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [photo, setPhoto] = useState("");
  const [saving, setSaving] = useState(false);

  function selectPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please select a JPG, JPEG or PNG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Profile photo must be 1 MB or smaller.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPhoto(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function savePhoto() {
    if (!photo) {
      toast.error("Please select a photo first.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ image: photo });
      if (error) throw new Error(error.message || "Could not update profile photo.");
      toast.success("Profile photo updated!");
      setPhoto("");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Could not update profile photo.");
    } finally {
      setSaving(false);
    }
  }

  if (isPending) return <main className="mx-auto max-w-2xl p-10">Loading profile...</main>;

  if (!user) {
    return (
      <main className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold">Sign in to view your profile</h1>
        <Link href="/login" className="mt-5 inline-block rounded-lg bg-blue-700 px-5 py-3 text-white">Sign In</Link>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-slate-50 px-4 py-12">
      <section className="mx-auto max-w-xl rounded-2xl border bg-white p-7 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">My Profile</h1>
        <p className="mt-2 text-sm text-slate-500">Manage your FixMate account and profile picture.</p>

        <div className="mt-8 flex flex-col items-center">
          {photo || user.image ? (
            <img src={photo || user.image} alt="Profile preview" className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover" />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-blue-700"><UserRound size={48} /></div>
          )}

          <label className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Camera size={17} /> Choose JPG / PNG photo
            <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={selectPhoto} className="hidden" />
          </label>
          <p className="mt-2 text-xs text-slate-400">Maximum size: 1 MB</p>

          <button onClick={savePhoto} disabled={!photo || saving} className="mt-4 rounded-lg bg-blue-700 px-6 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50">
            {saving ? "Saving..." : "Save Profile Photo"}
          </button>
        </div>

        <div className="mt-8 space-y-3 rounded-xl bg-slate-50 p-5 text-sm">
          <p><span className="font-semibold text-slate-500">Name:</span> {user.name}</p>
          <p><span className="font-semibold text-slate-500">Email:</span> {user.email}</p>
          <p><span className="font-semibold text-slate-500">Account type:</span> <span className="capitalize">{user.role || "customer"}</span></p>
        </div>

        <Link href={user.role === "admin" ? "/admin" : user.role === "technician" ? "/technician" : "/bookings"} className="mt-6 inline-block text-sm font-semibold text-blue-700 hover:underline">
          {user.role === "customer" || !user.role ? "Go to My Bookings" : "Go to Dashboard"} →
        </Link>
      </section>
    </main>
  );
}

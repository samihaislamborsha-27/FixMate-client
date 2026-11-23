"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { UserRound, CalendarDays, CreditCard, LogOut, LayoutDashboard, Wrench } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;
  const role = user?.role || "customer";

  const dashboard = role === "admin" ? "/admin" : role === "technician" ? "/technician" : "/dashboard";

  async function handleLogout() {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight text-blue-700">
          FixMate<span className="text-orange-500">.</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-600 sm:flex">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <Link href="/services" className="hover:text-blue-700">Services</Link>
          {user && role === "customer" && (
            <Link href="/bookings" className="hover:text-blue-700">My Bookings</Link>
          )}
          {user && <Link href={dashboard} className="hover:text-blue-700">Dashboard</Link>}
        </div>

        <div className="relative flex items-center gap-2">
          {!isPending && !user && (
            <>
              <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Sign in</Link>
              <Link href="/register" className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">Get Started</Link>
            </>
          )}

          {user && (
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 rounded-full border border-slate-200 p-1.5 pr-3 hover:bg-slate-50"
              aria-label="Open account menu"
            >
              {user.image ? (
                <img src={user.image} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <UserRound size={19} />
                </span>
              )}
              <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-700 sm:block">
                {user.name || "My Account"}
              </span>
            </button>
          )}

          {open && user && (
            <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-100 px-2 pb-3">
                {user.image ? (
                  <img src={user.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700"><UserRound size={23} /></span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                  <p className="mt-1 text-xs font-semibold capitalize text-blue-700">{role}</p>
                </div>
              </div>

              <div className="grid gap-1 pt-2 text-sm font-medium text-slate-700">
                <Link onClick={() => setOpen(false)} href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"><UserRound size={17} /> My Profile</Link>
                <Link onClick={() => setOpen(false)} href={dashboard} className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"><LayoutDashboard size={17} /> Dashboard</Link>
                {role === "customer" && (
                  <>
                    <Link onClick={() => setOpen(false)} href="/bookings" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"><CalendarDays size={17} /> My Bookings</Link>
                    <Link onClick={() => setOpen(false)} href="/payment/history" className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"><CreditCard size={17} /> Payment History</Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-red-600 hover:bg-red-50"><LogOut size={17} /> Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

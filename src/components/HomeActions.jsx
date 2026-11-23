"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function HomeActions({ variant = "hero" }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = user?.role;

  let primaryHref = "/register";
  let primaryText = "Book a Service";
  let secondaryHref = "/login";
  let secondaryText = "Sign In";

  if (isPending) {
    primaryHref = "/services";
    primaryText = "Explore Services";
  } else if (role === "customer") {
    primaryHref = "/services";
    primaryText = "Browse Services";
    secondaryHref = "/bookings";
    secondaryText = "My Bookings";
  } else if (role === "technician") {
    primaryHref = "/technician";
    primaryText = "Technician Dashboard";
    secondaryHref = "/technician/services/new";
    secondaryText = "Add a Service";
  } else if (role === "admin") {
    primaryHref = "/admin";
    primaryText = "Admin Dashboard";
    secondaryHref = "/services";
    secondaryText = "Browse Services";
  }

  if (variant === "footer") {
    return (
      <Link
        href={user ? primaryHref : "/register"}
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white hover:bg-orange-600"
      >
        {user ? primaryText : "Create Your Account"}
        <ArrowRight size={18} />
      </Link>
    );
  }

  return (
    <div className="mt-9 flex flex-wrap gap-4">
      <Link
        href={primaryHref}
        className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-bold text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600"
      >
        {primaryText}
        <ArrowRight size={18} />
      </Link>

      <Link
        href={secondaryHref}
        className="rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
      >
        {secondaryText}
      </Link>
    </div>
  );
}

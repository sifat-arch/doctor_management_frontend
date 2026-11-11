"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Doctors Directory",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    label: "Patient Records",
    href: "/patients",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, logout, isLoggingOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-zinc-200/90 bg-white lg:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white shadow-sm">
          <Stethoscope className="h-5 w-5 stroke-[2.2]" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-tight text-zinc-950 block">
            Doctor Tracker
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block -mt-0.5">
            Admin Workspace
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Core Navigation
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all",
                  isActive
                    ? "bg-black text-white shadow-xs font-semibold"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-white" : "text-zinc-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer */}
      <div className="border-t border-zinc-200/80 p-4">
        <div className="flex items-center justify-between rounded-xl bg-zinc-50 border border-zinc-200/80 p-3">
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              {currentUser?.role === "admin" ? (
                <ShieldCheck className="h-3.5 w-3.5 text-black shrink-0" />
              ) : (
                <UserCheck className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
              )}
              <span className="font-semibold text-xs text-zinc-900 truncate block">
                {currentUser?.email || "Authenticated User"}
              </span>
            </div>
            <div className="mt-1">
              <Badge variant="subtle" className="text-[10px] uppercase font-mono py-0">
                {currentUser?.role || "Admin"}
              </Badge>
            </div>
          </div>

          <button
            onClick={() => logout()}
            disabled={isLoggingOut}
            title="Sign Out"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200/80 hover:text-black"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

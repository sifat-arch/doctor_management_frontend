"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Client-side authentication check
  useEffect(() => {
    const token =
      Cookies.get("token") ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Suspense fallback={<div className="h-16 border-b border-zinc-200 bg-white" />}>
        <Sidebar />
      </Suspense>
      <div className="flex flex-col lg:pl-64">
        <Suspense fallback={<div className="h-16 border-b border-zinc-200 bg-white" />}>
          <Header />
        </Suspense>
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading workspace...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

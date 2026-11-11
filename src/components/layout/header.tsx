"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Stethoscope,
  Users,
  LayoutDashboard,
  LogOut,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { DoctorFormDialog } from "@/features/doctors/components/doctor-form-dialog";
import { PatientFormDialog } from "@/features/patients/components/patient-form-dialog";

export function Header() {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/") return "Clinical Dashboard";
    if (pathname.startsWith("/doctors")) return "Doctors Directory";
    if (pathname.startsWith("/patients")) return "Patient Records";
    return "Management Portal";
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200/90 bg-white/95 px-4 lg:px-8 backdrop-blur-md">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-950 sm:text-base">
              {getPageTitle()}
            </h1>
            <p className="hidden text-[11px] text-zinc-400 sm:block -mt-0.5">
              Doctor Tracker Healthcare Management System
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDoctorModalOpen(true)}
            className="h-8.5 gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add</span> Doctor
          </Button>

          <Button
            size="sm"
            onClick={() => setPatientModalOpen(true)}
            className="h-8.5 gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admit</span> Patient
          </Button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="h-full w-72 bg-white p-5 border-r border-zinc-200 flex flex-col justify-between">
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium",
                  pathname === "/"
                    ? "bg-black text-white font-semibold"
                    : "text-zinc-700 hover:bg-zinc-100"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/doctors"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium",
                  pathname.startsWith("/doctors")
                    ? "bg-black text-white font-semibold"
                    : "text-zinc-700 hover:bg-zinc-100"
                )}
              >
                <Stethoscope className="h-4 w-4" />
                <span>Doctors Directory</span>
              </Link>

              <Link
                href="/patients"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium",
                  pathname.startsWith("/patients")
                    ? "bg-black text-white font-semibold"
                    : "text-zinc-700 hover:bg-zinc-100"
                )}
              >
                <Users className="h-4 w-4" />
                <span>Patient Records</span>
              </Link>
            </nav>

            <div className="border-t border-zinc-100 pt-4">
              <p className="text-xs text-zinc-500 mb-2 truncate">
                {currentUser?.email}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full gap-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals from Header Action Buttons */}
      <DoctorFormDialog
        open={doctorModalOpen}
        onOpenChange={setDoctorModalOpen}
      />

      <PatientFormDialog
        open={patientModalOpen}
        onOpenChange={setPatientModalOpen}
      />
    </>
  );
}

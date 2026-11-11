"use client";

import React, { useState } from "react";
import { Search, Plus, Stethoscope, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DoctorTable } from "@/features/doctors/components/doctor-table";
import { DoctorFormDialog } from "@/features/doctors/components/doctor-form-dialog";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const { data: doctors, isLoading, refetch, isRefetching } = useDoctors(search);

  return (
    <div className="space-y-6">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">
              Medical Specialists Directory
            </h2>
            <Badge variant="subtle" className="text-xs">
              {doctors ? `${doctors.length} Doctors` : "Loading..."}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            View, search, edit clinical credentials, and manage doctors across hospital chambers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setFormDialogOpen(true)}
            className="h-9 gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add New Doctor
          </Button>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200/90 bg-white p-3 shadow-xs">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name, specialization, or chamber location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            className="h-9 text-xs"
          />
        </div>
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearch("")}
            className="h-8 text-xs text-zinc-500 hover:text-black"
          >
            Clear Search
          </Button>
        )}
      </div>

      {/* Doctors Table */}
      <DoctorTable doctors={doctors} isLoading={isLoading} />

      {/* Register Doctor Dialog */}
      <DoctorFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />
    </div>
  );
}

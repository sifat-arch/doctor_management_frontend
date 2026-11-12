"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  Filter,
  Calendar,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorTable } from "@/features/doctors/components/doctor-table";
import { DoctorFormDialog } from "@/features/doctors/components/doctor-form-dialog";
import { usePaginatedDoctors } from "@/features/doctors/hooks/use-doctors";

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Gastroenterology",
  "General Surgery",
  "Nephrology",
  "Psychiatry",
];

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const {
    data: doctorsData,
    isLoading,
    refetch,
    isRefetching,
  } = usePaginatedDoctors({
    page,
    limit: 8,
    search,
    specialization,
    sortBy: "createdAt",
    sortOrder: dateSort,
  });

  const handleResetFilters = () => {
    setSearch("");
    setSpecialization("all");
    setDateSort("desc");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" || specialization !== "all" || dateSort !== "desc";

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
              {doctorsData?.meta?.total !== undefined
                ? `${doctorsData.meta.total} Registered`
                : "Loading..."}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            View, search, filter by specialization and registration date, and manage doctor credentials across hospital chambers.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Search by name, specialization, or chamber location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search className="h-4 w-4" />}
            className="h-9 text-xs"
          />
        </div>

        {/* Specialization Filter */}
        <div>
          <Select
            value={specialization}
            onValueChange={(val) => {
              setSpecialization(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {SPECIALIZATIONS.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Sort Filter */}
        <div>
          <Select
            value={dateSort}
            onValueChange={(val: "desc" | "asc") => {
              setDateSort(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Sort by Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Date: Newest First</SelectItem>
              <SelectItem value="asc">Date: Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-zinc-400" />
            <span>Active filters applied</span>
          </div>
          <button
            onClick={handleResetFilters}
            className="font-medium text-black hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Doctors Table with Pagination */}
      <DoctorTable
        doctors={doctorsData?.doctors}
        isLoading={isLoading}
        meta={doctorsData?.meta}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Register Doctor Dialog */}
      <DoctorFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />
    </div>
  );
}

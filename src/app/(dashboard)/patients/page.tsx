"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  Users,
  RefreshCw,
  Filter,
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
import { PatientTable } from "@/features/patients/components/patient-table";
import { PatientFormDialog } from "@/features/patients/components/patient-form-dialog";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";
import { useConditionDistribution } from "@/features/analytics/hooks/use-analytics";

export default function PatientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");
  const [formDialogOpen, setFormDialogOpen] = useState(false);

  const { data: doctors } = useDoctors();
  const { data: conditions } = useConditionDistribution();

  const {
    data: patientsData,
    isLoading,
    refetch,
    isRefetching,
  } = usePatients({
    page,
    limit: 10,
    search,
    condition: selectedCondition,
    doctorId: selectedDoctor,
    sortBy: "createdAt",
    sortOrder: dateSort,
  });

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCondition("all");
    setSelectedDoctor("all");
    setDateSort("desc");
    setPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCondition !== "all" ||
    selectedDoctor !== "all" ||
    dateSort !== "desc";

  return (
    <div className="space-y-6">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">
              Patient Registry & Records
            </h2>
            <Badge variant="subtle" className="text-xs">
              {patientsData?.meta?.total !== undefined
                ? `${patientsData.meta.total} Registered`
                : "Loading..."}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Search, filter by medical diagnosis or assigned specialist, and manage patient profiles.
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
            Admit New Patient
          </Button>
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search by name or diagnosis..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            icon={<Search className="h-4 w-4" />}
            className="h-9 text-xs"
          />
        </div>

        {/* Condition Filter */}
        <div>
          <Select
            value={selectedCondition}
            onValueChange={(val) => {
              setSelectedCondition(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Medical Conditions</SelectItem>
              {conditions?.map((c) => (
                <SelectItem key={c.condition} value={c.condition}>
                  {c.condition} ({c.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Filter */}
        <div>
          <Select
            value={selectedDoctor}
            onValueChange={(val) => {
              setSelectedDoctor(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Doctors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assigned Doctors</SelectItem>
              {doctors?.map((d) => (
                <SelectItem key={d._id} value={d._id}>
                  {d.name}
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

      {/* Patients Table */}
      <PatientTable
        patients={patientsData?.patients}
        isLoading={isLoading}
        meta={patientsData?.meta}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* Register Patient Dialog */}
      <PatientFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
      />
    </div>
  );
}

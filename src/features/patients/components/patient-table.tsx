"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
  Phone,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { IPatient, IDoctor } from "@/types";
import { PatientFormDialog } from "./patient-form-dialog";
import { PatientDeleteDialog } from "./patient-delete-dialog";

interface PatientTableProps {
  patients: IPatient[] | undefined;
  isLoading: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export function PatientTable({
  patients,
  isLoading,
  meta,
  onPageChange,
}: PatientTableProps) {
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = (patient: IPatient) => {
    setSelectedPatient(patient);
    setEditDialogOpen(true);
  };

  const handleDelete = (patient: IPatient) => {
    setSelectedPatient(patient);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
          <User className="h-6 w-6 stroke-1" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No Patients Found</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
          No clinical records match your current filter or search query.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">Patient Name & Demographics</TableHead>
            <TableHead>Condition / Diagnosis</TableHead>
            <TableHead>Assigned Specialist</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const doctorObj =
              typeof patient.doctor === "object"
                ? (patient.doctor as IDoctor)
                : null;

            return (
              <TableRow key={patient._id} className="group">
                {/* Patient Name & Demographics */}
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 font-bold text-xs border border-zinc-200/80">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-zinc-900 block">
                        {patient.name}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-500">
                        <span>{patient.age} yrs</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Condition */}
                <TableCell>
                  <Badge variant="secondary" className="font-medium">
                    {patient.condition}
                  </Badge>
                </TableCell>

                {/* Assigned Doctor */}
                <TableCell>
                  {doctorObj ? (
                    <div>
                      <Link
                        href={`/doctors/${doctorObj._id}`}
                        className="font-medium text-xs text-zinc-900 hover:text-black hover:underline flex items-center gap-1.5"
                      >
                        <Stethoscope className="h-3 w-3 text-zinc-400" />
                        <span>{doctorObj.name}</span>
                      </Link>
                      <span className="text-[11px] text-zinc-400 block ml-4.5">
                        {doctorObj.specialization}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400">Unassigned</span>
                  )}
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-600">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{patient.phone}</span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        className="h-8 w-8 text-zinc-500 hover:text-black"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleEdit(patient)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Edit Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(patient)}
                        className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        <span>Discharge</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-200/80 px-2 py-4 text-xs text-zinc-500">
          <div>
            Showing{" "}
            <strong className="text-zinc-900 font-semibold">
              {(meta.page - 1) * meta.limit + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-zinc-900 font-semibold">
              {Math.min(meta.page * meta.limit, meta.total)}
            </strong>{" "}
            of{" "}
            <strong className="text-zinc-900 font-semibold">{meta.total}</strong>{" "}
            patients
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => onPageChange && onPageChange(meta.page - 1)}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>
            <span className="text-xs font-medium text-zinc-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => onPageChange && onPageChange(meta.page + 1)}
              className="h-8 px-2.5 gap-1 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <PatientFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        patientToEdit={selectedPatient}
      />

      <PatientDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        patient={selectedPatient}
      />
    </>
  );
}

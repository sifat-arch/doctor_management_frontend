"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  Building,
  Mail,
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
import { IDoctor } from "@/types";
import { DoctorFormDialog } from "./doctor-form-dialog";
import { DoctorDeleteDialog } from "./doctor-delete-dialog";

interface DoctorTableProps {
  doctors: IDoctor[] | undefined;
  isLoading: boolean;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export function DoctorTable({
  doctors,
  isLoading,
  meta,
  onPageChange,
}: DoctorTableProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEdit = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setEditDialogOpen(true);
  };

  const handleDelete = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-3">
          <Stethoscope className="h-6 w-6 stroke-1" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No Doctors Found</h3>
        <p className="mt-1 text-xs text-zinc-500 max-w-sm">
          No medical specialists match your current search criteria or filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Doctor & Specialty</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Chamber Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id} className="group">
              {/* Name & Specialty */}
              <TableCell>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 font-bold text-sm border border-zinc-200/80">
                    {doctor.name.replace(/^Dr\.\s*/i, "").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="font-semibold text-sm text-zinc-900 hover:text-black hover:underline transition-colors block truncate"
                    >
                      {doctor.name}
                    </Link>
                    <Badge variant="subtle" className="mt-1">
                      {doctor.specialization}
                    </Badge>
                  </div>
                </div>
              </TableCell>

              {/* Contact Info */}
              <TableCell>
                <div className="space-y-1 text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                    <span>{doctor.phone}</span>
                  </div>
                </div>
              </TableCell>

              {/* Hospital Location */}
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs text-zinc-700 max-w-[280px]">
                  <Building className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                  <span className="truncate">{doctor.chamberLocation}</span>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-xs text-zinc-600 hover:text-black"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Patients</span>
                    </Button>
                  </Link>

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
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/doctors/${doctor._id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-zinc-500" />
                          <span>View Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEdit(doctor)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Edit Info</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(doctor)}
                        className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        <span>Delete Doctor</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
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
            doctors
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

      <DoctorFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        doctorToEdit={selectedDoctor}
      />

      <DoctorDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        doctor={selectedDoctor}
      />
    </>
  );
}

"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IDoctor } from "@/types";
import { useDeleteDoctor } from "../hooks/use-doctors";

interface DoctorDeleteDialogProps {
  doctor: IDoctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DoctorDeleteDialog({
  doctor,
  open,
  onOpenChange,
}: DoctorDeleteDialogProps) {
  const deleteMutation = useDeleteDoctor();

  if (!doctor) return null;

  const handleDelete = () => {
    deleteMutation.mutate(doctor._id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-zinc-950 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
              <Trash2 className="h-4 w-4" />
            </div>
            <AlertDialogTitle>Remove Doctor Record</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            <strong className="text-zinc-900 font-semibold">{doctor.name}</strong> (
            {doctor.specialization})? This action cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-black text-white hover:bg-zinc-800"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm & Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

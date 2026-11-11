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
import { IPatient } from "@/types";
import { useDeletePatient } from "../hooks/use-patients";

interface PatientDeleteDialogProps {
  patient: IPatient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDeleteDialog({
  patient,
  open,
  onOpenChange,
}: PatientDeleteDialogProps) {
  const deleteMutation = useDeletePatient();

  if (!patient) return null;

  const handleDelete = () => {
    deleteMutation.mutate(patient._id, {
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
            <AlertDialogTitle>Discharge / Delete Patient</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Are you sure you want to delete the clinical record for{" "}
            <strong className="text-zinc-900 font-semibold">{patient.name}</strong>{" "}
            (Condition: {patient.condition})?
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

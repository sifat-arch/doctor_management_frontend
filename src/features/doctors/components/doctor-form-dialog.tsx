"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IDoctor } from "@/types";
import { doctorFormSchema, DoctorFormValues } from "../schemas/doctor.schema";
import { useCreateDoctor, useUpdateDoctor } from "../hooks/use-doctors";

interface DoctorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorToEdit?: IDoctor | null;
}

export function DoctorFormDialog({
  open,
  onOpenChange,
  doctorToEdit,
}: DoctorFormDialogProps) {
  const isEditing = !!doctorToEdit;
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      email: "",
      phone: "",
      chamberLocation: "",
    },
  });

  useEffect(() => {
    if (doctorToEdit) {
      reset({
        name: doctorToEdit.name,
        specialization: doctorToEdit.specialization,
        email: doctorToEdit.email,
        phone: doctorToEdit.phone,
        chamberLocation: doctorToEdit.chamberLocation,
      });
    } else {
      reset({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        chamberLocation: "",
      });
    }
  }, [doctorToEdit, reset]);

  const onSubmit = (values: DoctorFormValues) => {
    if (isEditing && doctorToEdit) {
      updateMutation.mutate(
        { id: doctorToEdit._id, payload: values },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <Stethoscope className="h-4 w-4" />
            </div>
            <DialogTitle>
              {isEditing ? "Edit Physician Details" : "Register New Physician"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEditing
              ? "Modify the contact and chamber information for this doctor."
              : "Enter full professional credentials to add a new doctor to the registry."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="doc-name">Doctor Full Name</Label>
            <Input
              id="doc-name"
              placeholder="e.g. Dr. Rafiqul Islam"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-spec">Specialization</Label>
            <Input
              id="doc-spec"
              placeholder="e.g. Cardiology, Neurology, Pediatrics"
              {...register("specialization")}
            />
            {errors.specialization && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.specialization.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="doc-email">Email Address</Label>
              <Input
                id="doc-email"
                type="email"
                placeholder="doctor@hospital.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-[11px] font-medium text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="doc-phone">Phone Number</Label>
              <Input
                id="doc-phone"
                placeholder="+8801711000000"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-[11px] font-medium text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-chamber">Hospital / Chamber Location</Label>
            <Input
              id="doc-chamber"
              placeholder="e.g. Square Hospital, Panthapath, Dhaka"
              {...register("chamberLocation")}
            />
            {errors.chamberLocation && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.chamberLocation.message}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Register Doctor
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

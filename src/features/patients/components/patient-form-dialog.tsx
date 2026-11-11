"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, UserPlus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IPatient } from "@/types";
import { patientFormSchema, PatientFormValues } from "../schemas/patient.schema";
import { useCreatePatient, useUpdatePatient } from "../hooks/use-patients";
import { useDoctors } from "@/features/doctors/hooks/use-doctors";

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientToEdit?: IPatient | null;
  defaultDoctorId?: string;
}

export function PatientFormDialog({
  open,
  onOpenChange,
  patientToEdit,
  defaultDoctorId,
}: PatientFormDialogProps) {
  const isEditing = !!patientToEdit;
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const { data: doctors, isLoading: isLoadingDoctors } = useDoctors();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema) as any,
    defaultValues: {
      name: "",
      age: 30,
      gender: "Male",
      phone: "",
      condition: "",
      doctor: defaultDoctorId || "",
    },
  });

  useEffect(() => {
    if (patientToEdit) {
      const docId =
        typeof patientToEdit.doctor === "object"
          ? patientToEdit.doctor?._id
          : patientToEdit.doctor;

      reset({
        name: patientToEdit.name,
        age: patientToEdit.age,
        gender: patientToEdit.gender,
        phone: patientToEdit.phone,
        condition: patientToEdit.condition,
        doctor: docId || "",
      });
    } else {
      reset({
        name: "",
        age: 30,
        gender: "Male",
        phone: "",
        condition: "",
        doctor: defaultDoctorId || "",
      });
    }
  }, [patientToEdit, defaultDoctorId, reset]);

  const onSubmit = (values: PatientFormValues) => {
    if (isEditing && patientToEdit) {
      updateMutation.mutate(
        { id: patientToEdit._id, payload: values },
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
              <UserPlus className="h-4 w-4" />
            </div>
            <DialogTitle>
              {isEditing ? "Edit Patient Record" : "Admit New Patient"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {isEditing
              ? "Update medical condition and clinical assignment."
              : "Register clinical profile and assign a primary care specialist."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="patient-name">Patient Full Name</Label>
            <Input
              id="patient-name"
              placeholder="e.g. Abdur Rahim"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="patient-age">Age (Years)</Label>
              <Input
                id="patient-age"
                type="number"
                min={1}
                max={120}
                {...register("age", { valueAsNumber: true })}
              />
              {errors.age && (
                <p className="text-[11px] font-medium text-red-600">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="patient-gender">Gender</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <SelectTrigger id="patient-gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-[11px] font-medium text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="patient-phone">Contact Phone</Label>
            <Input
              id="patient-phone"
              placeholder="+8801819000000"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="patient-condition">Diagnosis / Medical Condition</Label>
            <Input
              id="patient-condition"
              placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma"
              {...register("condition")}
            />
            {errors.condition && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.condition.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="patient-doctor">Assigned Specialist</Label>
            <Controller
              control={control}
              name="doctor"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  disabled={isLoadingDoctors}
                >
                  <SelectTrigger id="patient-doctor">
                    <SelectValue
                      placeholder={
                        isLoadingDoctors
                          ? "Loading doctors..."
                          : "Choose a physician"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors?.map((doc) => (
                      <SelectItem key={doc._id} value={doc._id}>
                        {doc.name} — {doc.specialization}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.doctor && (
              <p className="text-[11px] font-medium text-red-600">
                {errors.doctor.message}
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
                  Admit Patient
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

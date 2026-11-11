"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PatientTable } from "@/features/patients/components/patient-table";
import { PatientFormDialog } from "@/features/patients/components/patient-form-dialog";
import { useDoctor, useDoctorPatients } from "@/features/doctors/hooks/use-doctors";

function DoctorDetailContent() {
  const params = useParams();
  const doctorId = (params?.id as string) || "";

  const { data: doctor, isLoading: isLoadingDoctor } = useDoctor(doctorId);
  const { data: patients, isLoading: isLoadingPatients } =
    useDoctorPatients(doctorId);

  const [addPatientOpen, setAddPatientOpen] = useState(false);

  if (isLoadingDoctor) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white py-16 text-center">
        <Stethoscope className="h-8 w-8 text-zinc-300 mb-2" />
        <h3 className="text-base font-semibold text-zinc-900">
          Physician Not Found
        </h3>
        <p className="text-xs text-zinc-500 mt-1 mb-4">
          The requested doctor record does not exist or has been removed.
        </p>
        <Link href="/doctors">
          <Button variant="outline" size="sm">
            Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Doctors Directory
        </Link>
      </div>

      {/* Doctor Summary Header Card */}
      <Card className="overflow-hidden border-zinc-200/90 shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white font-bold text-xl shadow-md">
                {doctor.name.replace(/^Dr\.\s*/i, "").charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">
                    {doctor.name}
                  </h2>
                  <Badge variant="default" className="text-xs">
                    {doctor.specialization}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{doctor.chamberLocation}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                onClick={() => setAddPatientOpen(true)}
                size="sm"
                className="gap-1.5 h-9 text-xs font-semibold"
              >
                <UserPlus className="h-4 w-4" />
                Admit Patient for this Doctor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Under this Doctor Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-zinc-950 flex items-center gap-2">
              <Users className="h-4 w-4 text-zinc-900" />
              <span>Assigned Patients Caseload</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Patients actively assigned to {doctor.name}
            </p>
          </div>

          <Badge variant="subtle" className="text-xs">
            {patients ? `${patients.length} Active Patients` : "Loading..."}
          </Badge>
        </div>

        {/* Patient Table */}
        <PatientTable
          patients={patients}
          isLoading={isLoadingPatients}
        />
      </div>

      {/* Add patient dialog with this doctor pre-selected */}
      <PatientFormDialog
        open={addPatientOpen}
        onOpenChange={setAddPatientOpen}
        defaultDoctorId={doctor._id}
      />
    </div>
  );
}

export default function DoctorDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-zinc-400">Loading doctor details...</div>}>
      <DoctorDetailContent />
    </Suspense>
  );
}

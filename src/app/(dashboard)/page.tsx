"use client";

import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  Users,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/features/analytics/components/metric-card";
import { PatientTrendChart } from "@/features/analytics/components/patient-trend-chart";
import { DoctorWorkloadChart } from "@/features/analytics/components/doctor-workload-chart";
import { ConditionDistributionChart } from "@/features/analytics/components/condition-distribution-chart";
import {
  useDashboardSummary,
  usePatientTrend,
  usePatientsPerDoctor,
  useConditionDistribution,
} from "@/features/analytics/hooks/use-analytics";

export default function DashboardPage() {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: trendData, isLoading: isLoadingTrend } = usePatientTrend();
  const { data: workloadData, isLoading: isLoadingWorkload } =
    usePatientsPerDoctor();
  const { data: conditionData, isLoading: isLoadingCondition } =
    useConditionDistribution();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-xs">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Clinical Operations Center
          </span>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl mt-0.5">
            System Overview & Clinical Intelligence
          </h2>
          <p className="mt-1 text-xs text-zinc-500 max-w-xl">
            Real-time telemetry on active healthcare practitioners, patient admissions,
            and disease category distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/doctors">
            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs">
              <Stethoscope className="h-3.5 w-3.5" />
              Manage Doctors
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Button>
          </Link>
          <Link href="/patients">
            <Button size="sm" className="h-9 gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              All Patients
              <ArrowRight className="h-3 w-3 text-zinc-400" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Active Medical Specialists"
          value={summary?.totalDoctors}
          subtitle="Certified practitioners in directory"
          icon={<Stethoscope className="h-4.5 w-4.5" />}
          isLoading={isLoadingSummary}
        />
        <MetricCard
          title="Admitted Patients"
          value={summary?.totalPatients}
          subtitle="Total registered clinical profiles"
          icon={<Users className="h-4.5 w-4.5" />}
          isLoading={isLoadingSummary}
        />
        <MetricCard
          title="System Personnel"
          value={summary?.totalUsers}
          subtitle="Active clinical administrators"
          icon={<ShieldCheck className="h-4.5 w-4.5" />}
          isLoading={isLoadingSummary}
        />
      </div>

      {/* Primary Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PatientTrendChart data={trendData} isLoading={isLoadingTrend} />
        <DoctorWorkloadChart data={workloadData} isLoading={isLoadingWorkload} />
      </div>

      {/* Condition Breakdown */}
      <div>
        <ConditionDistributionChart
          data={conditionData}
          isLoading={isLoadingCondition}
        />
      </div>
    </div>
  );
}

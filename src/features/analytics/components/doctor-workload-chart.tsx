"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IPatientsPerDoctor } from "@/types";

interface DoctorWorkloadChartProps {
  data: IPatientsPerDoctor[] | undefined;
  isLoading: boolean;
}

export function DoctorWorkloadChart({ data, isLoading }: DoctorWorkloadChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-1">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-52 mt-1" />
        </CardHeader>
        <CardContent className="h-72">
          <Skeleton className="h-full w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  // Display top 6 doctors by workload
  const displayData = (data || []).slice(0, 6).map((d) => ({
    ...d,
    shortName: d.doctorName.replace(/^Dr\.\s*/i, ""),
  }));

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Specialist Workload</CardTitle>
        <CardDescription>
          Patient distribution across active medical specialists
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 11 }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="shortName"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#27272a", fontSize: 12, fontWeight: 500 }}
                width={75}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as IPatientsPerDoctor;
                    return (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white shadow-xl">
                        <p className="text-xs font-semibold text-white">
                          {item.doctorName}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {item.specialization}
                        </p>
                        <p className="text-sm font-bold text-white mt-1.5">
                          {item.patientCount}{" "}
                          <span className="text-xs font-normal text-zinc-400">
                            Assigned Patients
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="patientCount"
                fill="#09090b"
                radius={[0, 6, 6, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IPatientTrend } from "@/types";

interface PatientTrendChartProps {
  data: IPatientTrend[] | undefined;
  isLoading: boolean;
}

export function PatientTrendChart({ data, isLoading }: PatientTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-64 mt-1" />
        </CardHeader>
        <CardContent className="h-72">
          <Skeleton className="h-full w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Patient Registration Flow</CardTitle>
            <CardDescription>
              Monthly admission and registration trajectory across clinic records
            </CardDescription>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200">
            Past 5 Months
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="patientTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#09090b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#09090b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
              <XAxis
                dataKey="monthName"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as IPatientTrend;
                    return (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white shadow-xl">
                        <p className="text-xs text-zinc-400 font-mono">
                          {item.monthName} {item.year} ({item.period})
                        </p>
                        <p className="text-base font-bold text-white mt-1">
                          {item.count}{" "}
                          <span className="text-xs font-normal text-zinc-400">
                            Registered Patients
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#09090b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#patientTrendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

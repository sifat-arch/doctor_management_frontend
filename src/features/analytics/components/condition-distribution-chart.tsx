"use client";

import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IConditionDistribution } from "@/types";

interface ConditionDistributionChartProps {
  data: IConditionDistribution[] | undefined;
  isLoading: boolean;
}

export function ConditionDistributionChart({
  data,
  isLoading,
}: ConditionDistributionChartProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3.5 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = data || [];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-zinc-900" />
              <span>Clinical Condition Distribution</span>
            </CardTitle>
            <CardDescription>
              Breakdown of diagnosed primary patient medical conditions and caseload percentages
            </CardDescription>
          </div>
          <Badge variant="subtle">{items.length} Diagnoses Tracked</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.condition}
              className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 transition-all hover:bg-white hover:border-zinc-300 hover:shadow-xs"
            >
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-xs text-zinc-900 truncate">
                  {item.condition}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {item.count} {item.count === 1 ? "Patient" : "Patients"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-16 h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-xs font-semibold text-zinc-900 w-10 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

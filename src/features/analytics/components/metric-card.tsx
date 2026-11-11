import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: number | string | undefined;
  subtitle?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  isLoading,
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:border-zinc-300 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {title}
          </p>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200/80 group-hover:bg-black group-hover:text-white transition-colors">
            {icon}
          </div>
        </div>

        <div className="mt-3">
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-3xl font-bold tracking-tight text-zinc-950">
              {value ?? 0}
            </div>
          )}
          {subtitle && (
            <p className="mt-1 text-xs text-zinc-400 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

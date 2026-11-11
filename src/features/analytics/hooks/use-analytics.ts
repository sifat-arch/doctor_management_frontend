"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  IDashboardSummary,
  IPatientsPerDoctor,
  IPatientTrend,
  IConditionDistribution,
} from "@/types";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IDashboardSummary>>(
        "/analytics/summary"
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePatientsPerDoctor() {
  return useQuery({
    queryKey: ["analytics", "patients-per-doctor"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IPatientsPerDoctor[]>>(
        "/analytics/patients-per-doctor"
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function usePatientTrend() {
  return useQuery({
    queryKey: ["analytics", "patient-trend"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IPatientTrend[]>>(
        "/analytics/patient-trend"
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useConditionDistribution() {
  return useQuery({
    queryKey: ["analytics", "condition-distribution"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IConditionDistribution[]>>(
        "/analytics/condition-distribution"
      );
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

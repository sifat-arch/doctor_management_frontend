"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, IPatient } from "@/types";
import { PatientFormValues } from "../schemas/patient.schema";

interface UsePatientsParams {
  page?: number;
  limit?: number;
  search?: string;
  condition?: string;
  doctorId?: string;
}

export function usePatients(params: UsePatientsParams = {}) {
  const { page = 1, limit = 10, search, condition, doctorId } = params;

  return useQuery({
    queryKey: ["patients", { page, limit, search, condition, doctorId }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", String(page));
      queryParams.set("limit", String(limit));
      if (search && search.trim()) queryParams.set("search", search.trim());

      const res = await apiClient.get<ApiResponse<IPatient[]>>(
        `/patients?${queryParams.toString()}`
      );

      let data = res.data.data;
      let total = res.data.meta?.total || data.length;

      // Client-side filtering for condition or doctor if backend doesn't take them as query params
      if (condition && condition !== "all") {
        data = data.filter((p) => p.condition.toLowerCase() === condition.toLowerCase());
      }
      if (doctorId && doctorId !== "all") {
        data = data.filter((p) => {
          const docId = typeof p.doctor === "object" ? p.doctor?._id : p.doctor;
          return docId === doctorId;
        });
      }

      return {
        patients: data,
        meta: {
          page: res.data.meta?.page || page,
          limit: res.data.meta?.limit || limit,
          total: total,
          totalPages: res.data.meta?.totalPages || Math.ceil(total / limit),
        },
      };
    },
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IPatient>>(`/patients/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PatientFormValues) => {
      const res = await apiClient.post<ApiResponse<IPatient>>("/patients", payload);
      return res.data.data;
    },
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Patient Registered", {
        description: `${newPatient.name} has been assigned to a specialist.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message,
      });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<PatientFormValues>;
    }) => {
      const res = await apiClient.patch<ApiResponse<IPatient>>(
        `/patients/${id}`,
        payload
      );
      return res.data.data;
    },
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", updatedPatient._id] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Patient Record Updated", {
        description: `${updatedPatient.name}'s record is updated.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Update failed", {
        description: error.message,
      });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/patients/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Patient Record Deleted", {
        description: "The patient record has been removed.",
      });
    },
    onError: (error: Error) => {
      toast.error("Deletion failed", {
        description: error.message,
      });
    },
  });
}

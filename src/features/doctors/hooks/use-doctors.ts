"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, IDoctor, IPatient } from "@/types";
import { DoctorFormValues } from "../schemas/doctor.schema";

export function useDoctors(search?: string) {
  return useQuery({
    queryKey: ["doctors", { search }],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IDoctor[]>>("/doctors");
      let data = res.data.data;
      if (search && search.trim() !== "") {
        const query = search.toLowerCase();
        data = data.filter(
          (doc) =>
            doc.name.toLowerCase().includes(query) ||
            doc.specialization.toLowerCase().includes(query) ||
            doc.chamberLocation.toLowerCase().includes(query) ||
            doc.email.toLowerCase().includes(query)
        );
      }
      return data;
    },
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IDoctor>>(`/doctors/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useDoctorPatients(doctorId: string) {
  return useQuery({
    queryKey: ["doctors", doctorId, "patients"],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<IPatient[]>>(
        `/doctors/${doctorId}/patients`
      );
      return res.data.data;
    },
    enabled: !!doctorId,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DoctorFormValues) => {
      const res = await apiClient.post<ApiResponse<IDoctor>>("/doctors", payload);
      return res.data.data;
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Doctor Added", {
        description: `${newDoc.name} has been successfully registered.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to add doctor", {
        description: error.message,
      });
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<DoctorFormValues>;
    }) => {
      const res = await apiClient.patch<ApiResponse<IDoctor>>(
        `/doctors/${id}`,
        payload
      );
      return res.data.data;
    },
    onSuccess: (updatedDoc) => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctors", updatedDoc._id] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Doctor Profile Updated", {
        description: `${updatedDoc.name}'s information has been refreshed.`,
      });
    },
    onError: (error: Error) => {
      toast.error("Update failed", {
        description: error.message,
      });
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/doctors/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Doctor Removed", {
        description: "The doctor record has been deleted from the directory.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete doctor", {
        description: error.message,
      });
    },
  });
}

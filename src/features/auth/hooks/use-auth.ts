"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ApiResponse, IUser } from "@/types";
import { LoginFormValues } from "../schemas/login.schema";

interface LoginResponseData {
  _id: string;
  email: string;
  role: "admin";
  token: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Get current user query
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      if (!token) return null;
      try {
        const res = await apiClient.get<ApiResponse<IUser>>("/auth/me");
        return res.data.data;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const res = await apiClient.post<ApiResponse<LoginResponseData>>(
        "/auth/login",
        credentials
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("userRole", data.role, { expires: 7 });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({ _id: data._id, email: data.email, role: data.role })
        );
      }
      queryClient.setQueryData(["auth", "me"], {
        _id: data._id,
        email: data.email,
        role: data.role,
      });
      toast.success("Welcome back!", {
        description: `Signed in as ${data.email} (${data.role})`,
      });
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error("Authentication Failed", {
        description: error.message || "Invalid email or password",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/auth/logout");
      } catch {
        // Proceed with local logout regardless of server response
      }
    },
    onSettled: () => {
      Cookies.remove("token");
      Cookies.remove("userRole");
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      queryClient.clear();
      toast.success("Signed out successfully");
      router.push("/login");
    },
  });

  return {
    currentUser,
    isLoadingUser,
    isAuthenticated: !!currentUser,
    isError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, Loader2, Stethoscope, ShieldCheck, UserCheck } from "lucide-react";
import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  const setAdminCredentials = () => {
    setValue("email", "admin@doctortracker.com", { shouldValidate: true });
    setValue("password", "Admin@123456", { shouldValidate: true });
  };

  const setStaffCredentials = () => {
    setValue("email", "staff@doctortracker.com", { shouldValidate: true });
    setValue("password", "Staff@123456", { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200/90 bg-white p-8 shadow-xl shadow-zinc-200/40">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white shadow-md">
          <Stethoscope className="h-6 w-6 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
          Doctor Tracker
        </h1>
        <p className="mt-1.5 text-xs text-zinc-500">
          Secure Clinical Administration & Analytics Portal
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@doctortracker.com"
            icon={<Mail className="h-4 w-4" />}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-[11px] font-medium text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-[11px] text-zinc-400">Default: Admin@123456</span>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••"
            icon={<Lock className="h-4 w-4" />}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-[11px] font-medium text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoggingIn}
          className="w-full mt-2 h-10.5 text-sm font-semibold tracking-wide"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In to Dashboard"
          )}
        </Button>
      </form>

      {/* Quick Credentials Filler for Evaluation */}
      <div className="mt-8 border-t border-zinc-100 pt-6">
        <p className="mb-3 text-center text-[10px] font-semibold tracking-widest uppercase text-zinc-400">
          Quick Demo Credentials
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={setAdminCredentials}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-black"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-zinc-900" />
            Admin Account
          </button>
          <button
            type="button"
            onClick={setStaffCredentials}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-black"
          >
            <UserCheck className="h-3.5 w-3.5 text-zinc-900" />
            Staff Account
          </button>
        </div>
      </div>
    </div>
  );
}

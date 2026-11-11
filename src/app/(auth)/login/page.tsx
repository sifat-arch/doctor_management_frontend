import React from "react";
import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In — Doctor Tracker",
  description: "Secure login for clinical administrators and medical staff.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50/70 p-4">
      <LoginForm />
    </main>
  );
}

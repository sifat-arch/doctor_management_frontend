import { z } from "zod";

export const patientFormSchema = z.object({
  name: z.string().min(2, "Patient full name must be at least 2 characters"),
  age: z.number().min(1, "Age must be at least 1").max(125, "Invalid age"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  condition: z.string().min(2, "Medical condition or diagnosis is required"),
  doctor: z.string().min(1, "Please select an assigned doctor"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

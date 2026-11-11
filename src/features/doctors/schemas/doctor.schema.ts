import { z } from "zod";

export const doctorFormSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters").max(60),
  specialization: z.string().min(2, "Specialization is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  chamberLocation: z.string().min(3, "Hospital or chamber location is required"),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T;
}

export type UserRole = "admin" | "staff";

export interface IUser {
  _id: string;
  email: string;
  role: UserRole;
}

export interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  email: string;
  phone: string;
  chamberLocation: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPatient {
  _id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  condition: string;
  doctor: IDoctor | string;
  createdAt: string;
  updatedAt: string;
}

export interface IDashboardSummary {
  totalDoctors: number;
  totalPatients: number;
  totalUsers: number;
}

export interface IPatientsPerDoctor {
  doctorId: string;
  doctorName: string;
  specialization: string;
  chamberLocation?: string;
  patientCount: number;
}

export interface IPatientTrend {
  year: number;
  month: number;
  monthName: string;
  period: string;
  count: number;
}

export interface IConditionDistribution {
  condition: string;
  count: number;
  percentage: number;
}

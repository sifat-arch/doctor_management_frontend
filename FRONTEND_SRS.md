# 📋 Software Requirements Specification (SRS)
## 🩺 Doctor Tracker — Modern Web Client (Frontend)

---

### 📑 Document Meta
- **Project Name:** Doctor Tracker — Administrative Web Application
- **Target Application:** Frontend Client
- **Document Version:** 1.0.0
- **Architecture Pattern:** Feature-based / Modular Next.js App Router Architecture
- **Target Audience:** Frontend Developers, QA Engineers, Evaluators

---

## 1. 🎯 Project Overview & Objectives

### 1.1 Executive Summary
**Doctor Tracker** is an enterprise-grade administrative web application designed for healthcare facilities and clinic administrators to manage doctor directories, patient records, and real-time clinical workload analytics. The frontend prioritizes a clean, high-performance, and visually appealing user experience (UX) with responsive layouts, accessible UI components, and real-time chart data visualization.

### 1.2 Core Objectives
- **Secure Access:** Strict role-based protected navigation using Next.js Middleware and HTTP-only cookies / JWT authentication.
- **Optimized Data Operations:** High-speed search, date/condition filtering, and server-side pagination powered by TanStack Query caching and debouncing.
- **Doctor & Patient Relationships:** Seamless association where administrators can view, assign, and manage patients directly under specific doctors as well as through dedicated patient dashboards.
- **Clinical Data Visualization:** Rich graphical analytics (charts, metrics, workload distribution) for quick decision-making.
- **Accessible, Modern UI:** Designed with Shadcn UI (Radix UI primitives) and Tailwind CSS for responsive mobile and desktop accessibility.

---

## 2. 🛠 Technology Stack & Tools

| Category | Technology | Purpose & Rationale |
| :--- | :--- | :--- |
| **Core Framework** | **Next.js (v14/15 App Router)** | Server & Client components, file-system routing, SEO/performance, and Next.js middleware protection. |
| **Language** | **TypeScript (v5+)** | Strict type safety, interface contracts with backend API types. |
| **Server State & Caching** | **TanStack Query (React Query v5)** | Asynchronous state management, server cache, background revalidation, optimistic updates, query deduplication. |
| **Form Management** | **React Hook Form** | Performant, uncontrolled form inputs minimizing re-renders. |
| **Schema Validation** | **Zod** | Type-safe form validation matching backend validation schemas. |
| **UI Components** | **Shadcn UI (Radix UI)** | Accessible, headless, customizable UI primitives (Dialog, Sheet, Table, Dropdown, Select, etc.). |
| **Styling** | **Tailwind CSS** | Utility-first responsive design, dark/light theme support. |
| **Icons** | **Lucide React** | Clean and consistent icon set. |
| **Data Visualization** | **Recharts / Shadcn Chart** | Interactive bar charts, area trends, donut charts for clinical metrics. |
| **Notifications** | **Sonner** | Modern toast notification system for feedback (success, errors). |
| **HTTP Client** | **Axios / Native Fetch** | Configured with base URL, credentials (`withCredentials: true`), and response error interceptors. |

---

## 3. 📂 Modular Frontend Architecture & Folder Structure

```
doctor_management_frontend/
│
├── public/                     # Static assets (logos, illustrations, favicon)
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Route Group for unauthenticated views
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Secure Administrator Login Page
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/        # Route Group for authenticated portal views
│   │   │   ├── layout.tsx      # Dashboard Shell (Sidebar, Header, Breadcrumbs)
│   │   │   ├── page.tsx        # Analytics Dashboard Overview
│   │   │   ├── doctors/
│   │   │   │   ├── page.tsx    # Doctor Directory (Search, Filter, Table)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx# Single Doctor Details & Assigned Patients
│   │   │   └── patients/
│   │   │       └── page.tsx    # Dedicated Patient Management Page
│   │   │
│   │   ├── api/                # Optional Next.js internal API route handlers
│   │   ├── layout.tsx          # Root Layout (Theme, TanStack Query Provider, Toaster)
│   │   └── globals.css         # Tailwind styles & theme variables
│   │
│   ├── components/             # Global reusable UI building blocks
│   │   ├── ui/                 # Shadcn UI primitives (Button, Dialog, Table, etc.)
│   │   ├── layout/             # Sidebar, Navbar, MobileNav, Breadcrumb
│   │   ├── shared/             # SearchInput, PaginationControls, ConfirmDialog, StateHandler
│   │   └── feedback/           # LoadingSkeletons, EmptyState, ErrorCard
│   │
│   ├── features/               # Feature-Driven Business Modules
│   │   ├── auth/
│   │   │   ├── components/     # LoginForm, AuthGuard
│   │   │   ├── hooks/          # useLogin, useLogout, useCurrentUser
│   │   │   ├── schemas/        # loginValidationSchema (Zod)
│   │   │   └── types/          # AuthUser, LoginPayload
│   │   │
│   │   ├── doctors/
│   │   │   ├── components/     # DoctorTable, DoctorCard, DoctorFormModal, DoctorDetailsCard
│   │   │   ├── hooks/          # useDoctors, useDoctorDetails, useCreateDoctor, useUpdateDoctor, useDeleteDoctor
│   │   │   ├── schemas/        # doctorFormSchema (Zod)
│   │   │   └── types/          # IDoctor, DoctorQueryParams
│   │   │
│   │   ├── patients/
│   │   │   ├── components/     # PatientTable, PatientFormModal, PatientFilters, AssignDoctorModal
│   │   │   ├── hooks/          # usePatients, usePatientDetails, useCreatePatient, useUpdatePatient, useDeletePatient
│   │   │   ├── schemas/        # patientFormSchema (Zod)
│   │   │   └── types/          # IPatient, PatientFilters
│   │   │
│   │   └── analytics/
│   │       ├── components/     # MetricSummaryCards, PatientTrendChart, DoctorWorkloadChart, ConditionPieChart
│   │       ├── hooks/          # useAnalyticsSummary, usePatientTrend, useDoctorWorkload, useConditionDistribution
│   │       └── types/          # AnalyticsData, TrendItem, DistributionItem
│   │
│   ├── hooks/                  # Global shared hooks (useDebounce, useMediaQuery)
│   ├── lib/                    # API client instance (axios), utils, query-client config
│   ├── middleware.ts           # Route Protection & Cookie Redirection
│   └── types/                  # Global API Response Envelopes & Utility Types
│
├── .env.example                # Template for environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 4. 🔐 Authentication, Authorization & Route Protection

### 4.1 Authentication Workflow
1. User enters Email and Password at `/login`.
2. Form is validated in real-time using `loginSchema` (Zod).
3. Payload is submitted to `POST /api/v1/auth/login`.
4. On success:
   - Backend sets HTTP-only secure cookie and returns JWT token + user profile.
   - Frontend persists token in state / cookies (`token`, `userRole`).
   - Query client invalidates auth query and navigates user to `/` (Dashboard).
   - Sonner toast confirms: `"Welcome back, Admin!"`.

### 4.2 Middleware Route Guard (`middleware.ts`)
- Unauthenticated requests to `/`, `/doctors/*`, `/patients/*` are intercepted and redirected to `/login?redirect=<target_url>`.
- Authenticated requests visiting `/login` are automatically redirected to the dashboard `/`.

---

## 5. 🖥 Core Module Specifications

### 5.1 Module 1: Dashboard & Analytics (`/`)
- **Metric Cards (Top Row):**
  - Total Doctors (Icon: `Stethoscope`, Trend indicator)
  - Total Patients (Icon: `Users`, Trend indicator)
  - Active Administrators (Icon: `ShieldCheck`)
- **Visual Chart 1: Patient Registration Trend (Area / Line Chart)**
  - Month-over-month admission flow (`2026-07` to `2026-11`).
  - Interactive tooltip displaying patient count.
- **Visual Chart 2: Doctor Patient Workload (Horizontal Bar Chart)**
  - Breakdown of patients per doctor.
  - Highlights highest patient volume specialists.
- **Visual Chart 3: Medical Condition Distribution (Donut / Pie Chart)**
  - Categorization of conditions (Hypertension, Diabetes, Asthma, etc.) with legend and percentages.
- **Quick Action Buttons:**
  - `+ Add New Doctor`
  - `+ Add New Patient`

---

### 5.2 Module 2: Doctor Management (`/doctors` & `/doctors/[id]`)
- **Main View (`/doctors`):**
  - **Header Controls:** Search bar (debounced text search across doctor name and specialization), Refresh button, `+ Add Doctor` trigger button.
  - **Data Table (Shadcn Table):**
    - Columns: Name, Specialization, Contact (Email & Phone), Chamber Location, Assigned Patients Count, Actions.
    - Action Menu (Dropdown): `View Details`, `Edit Doctor`, `View Patients`, `Delete Doctor` (with confirmation modal).
- **Add / Edit Doctor Modal Dialog:**
  - Form built with React Hook Form + Zod:
    - Doctor Full Name (`z.string().min(2)`)
    - Specialization (`z.string().min(2)`)
    - Email (`z.string().email()`)
    - Phone (`z.string().min(10)`)
    - Chamber Location / Hospital (`z.string().min(2)`)
- **Doctor Details View (`/doctors/[id]`):**
  - Left panel: Doctor profile card with contact and hospital information.
  - Right panel: Sub-table of patients currently assigned to this doctor.
  - Quick action: `+ Add Patient Under This Doctor` directly opens the patient modal with this doctor pre-selected.
  - Ability to remove patient directly from doctor's list.

---

### 5.3 Module 3: Patient Management (`/patients`)
- **Dedicated Patient List View:**
  - **Filter & Search Toolbar:**
    - Real-time search by Patient Name or Medical Condition.
    - Dropdown filter by Assigned Doctor.
    - Dropdown filter by Condition (e.g., Hypertension, Diabetes, etc.).
    - Date range filter.
  - **Data Table:**
    - Columns: Patient ID, Full Name, Age, Gender (`Male`, `Female`, `Other`), Phone, Condition, Assigned Doctor (Badge), Registered Date, Actions.
    - Actions: `Edit Patient`, `Delete Patient`.
  - **Pagination Controls:**
    - Previous, Next, Page Numbers, Items per Page selector (`10`, `20`, `50`).
- **Create / Edit Patient Modal Dialog:**
  - Full Name (`z.string().min(2)`)
  - Age (`z.number().min(1).max(120)`)
  - Gender (`enum: ['Male', 'Female', 'Other']`)
  - Contact Phone (`z.string().min(10)`)
  - Medical Condition / Diagnosis (`z.string().min(2)`)
  - Assigned Doctor Selection (Searchable Select dropdown populated dynamically via `useDoctors` query).

---

## 6. ⚡ TanStack Query State Management Strategy

### 6.1 Query Keys Hierarchy
Standardized query keys to avoid collisions and enable targeted cache invalidation:
```typescript
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  doctors: {
    all: ['doctors'] as const,
    list: (params?: Record<string, any>) => ['doctors', 'list', params] as const,
    detail: (id: string) => ['doctors', 'detail', id] as const,
    patients: (id: string) => ['doctors', id, 'patients'] as const,
  },
  patients: {
    all: ['patients'] as const,
    list: (params?: Record<string, any>) => ['patients', 'list', params] as const,
    detail: (id: string) => ['patients', 'detail', id] as const,
  },
  analytics: {
    summary: ['analytics', 'summary'] as const,
    patientsPerDoctor: ['analytics', 'patients-per-doctor'] as const,
    trend: ['analytics', 'trend'] as const,
    distribution: ['analytics', 'distribution'] as const,
  },
};
```

### 6.2 Cache Invalidation Lifecycle
- **After Creating/Updating/Deleting a Doctor:**
  - Invalidate `queryKeys.doctors.all`
  - Invalidate `queryKeys.analytics.summary`
  - Invalidate `queryKeys.analytics.patientsPerDoctor`
- **After Creating/Updating/Deleting a Patient:**
  - Invalidate `queryKeys.patients.all`
  - Invalidate `queryKeys.doctors.patients(doctorId)`
  - Invalidate `queryKeys.analytics.all`

---

## 7. 📝 Form Management & Zod Validation Contracts

### 7.1 Doctor Form Schema (`doctor.schema.ts`)
```typescript
import { z } from "zod";

export const doctorFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(60),
  specialization: z.string().min(2, "Specialization is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  chamberLocation: z.string().min(3, "Chamber location is required"),
});

export type DoctorFormValues = z.infer<typeof doctorFormSchema>;
```

### 7.2 Patient Form Schema (`patient.schema.ts`)
```typescript
import { z } from "zod";

export const patientFormSchema = z.object({
  name: z.string().min(2, "Patient name must be at least 2 characters"),
  age: z.coerce.number().min(1, "Age must be greater than 0").max(120),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  condition: z.string().min(2, "Medical condition is required"),
  doctor: z.string().min(1, "Please select an assigned doctor"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
```

---

## 8. 🎨 UI/UX Design System (Shadcn UI & Tailwind)

### 8.1 Required Shadcn UI Components
The following Shadcn UI primitives will be initialized:
- `Button` (Primary, Destructive, Outline, Ghost)
- `Dialog` & `AlertDialog` (Create modals, delete confirmation prompts)
- `Table` (Doctor and patient responsive data grids)
- `Input` & `Textarea` (Form field controls)
- `Select` & `Combobox` (Doctor picker, gender picker)
- `Card` (Metric containers, analytics chart wrappers)
- `Badge` (Role badges, gender and condition pills)
- `Skeleton` (Shimmer loading placeholders)
- `DropdownMenu` (Row-level context actions)
- `Sonner` (Interactive toast feedback)

### 8.2 UX Best Practices
- **Optimistic UI / Instant Feedback:** Visual loading states on buttons (`disabled`, spinning loader icon).
- **Graceful Error Handling:** Inline form errors rendered below respective inputs in red text.
- **Empty States:** Meaningful illustrations and clear call-to-actions when zero results are found in search or tables.
- **Delete Confirmation:** Every destructive action (deleting a doctor or patient) requires two-step confirmation via an `AlertDialog`.

---

## 9. 🌐 Backend API Integration

The frontend directly consumes the deployed production REST API:
- **Production API URL:** `https://doctormanagementbackend.vercel.app/api/v1`
- **Local API URL:** `http://localhost:5000/api/v1`

### 9.1 Axios HTTP Client Configuration (`src/lib/api-client.ts`)
```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://doctormanagementbackend.vercel.app/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An unexpected error occurred";
    if (error.response?.status === 401 && typeof window !== "undefined") {
      // Clear token and redirect to login if session expires
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(new Error(message));
  }
);
```

---

## 10. 🚀 Environment Configuration & Deployment Target

### 10.1 Environment Variables (`.env.example`)
```env
# Backend API Base URL
NEXT_PUBLIC_API_URL=https://doctormanagementbackend.vercel.app/api/v1

# Application Details
NEXT_PUBLIC_APP_NAME="Doctor Tracker"
```

### 10.2 Deployment
- **Target Platform:** **Vercel** (One-click deployment via GitHub or Vercel CLI).
- **Build Command:** `next build`
- **Output:** Optimized Next.js Serverless application.

---

## 11. ✅ Definition of Done (DoD) Checklist

- [ ] Next.js 14/15 App Router initialized with TypeScript and Tailwind CSS.
- [ ] Shadcn UI components configured and dark/light system setup.
- [ ] TanStack Query Provider setup with error boundary and query client configuration.
- [ ] Authentication Module: Login page with validation, cookie persistence, and route guard middleware.
- [ ] Analytics Dashboard: 3 metric cards + 3 visual charts (Trend, Doctor workload, Condition breakdown).
- [ ] Doctor Module: Paginated table, real-time search, add/edit modals, details page with sub-table of patients.
- [ ] Patient Module: Paginated table, search & filter (by condition/doctor/date), add/edit modal dialogs.
- [ ] Error Handling: Sonner toast alerts for success/failure on every mutation.
- [ ] Mobile & Tablet responsive design verified on multiple viewports.
- [ ] Final deployment to Vercel with live link and README documentation.

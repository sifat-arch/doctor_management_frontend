# 🩺 Doctor Tracker — Modern Web Client (Frontend)

> **High-Performance Clinical Management & Telemetry Portal** built with **Next.js 15 (App Router)**, **TypeScript**, **TanStack Query v5**, **React Hook Form**, **Zod**, and **Tailwind CSS**. Designed with an ultra-clean **Monochrome / Black & White** aesthetic.

---

## 🎨 Design Philosophy & Theme

- **Palette:** Minimalist High-Contrast Black & White (`#000000`, `#ffffff`, subtle `#f4f4f5` neutral accents, and crisp `#e4e4e7` zinc borders).
- **Component Styling:** Custom-crafted beyond default shadcn primitives — micro-interactions, sleek rounded corners (`rounded-xl` / `rounded-2xl`), subtle drop shadows (`shadow-xs`), refined table typography, and interactive button active states.
- **Data Visualization:** High-clarity monochrome charts via **Recharts** (Area flow gradients, horizontal workload bars, and diagnosis distribution meters).

---

## 🚀 Key Features

### 1. 🔐 Authentication & Session Security
- Dedicated login page at `/login` with real-time Zod schema validation.
- One-click demo credential fillers (`Admin` / `Staff`) for rapid evaluation.
- Cookie & localStorage token synchronization.
- Next.js Edge Middleware route guarding for automatic redirects between `/login` and protected dashboard paths.

### 2. 📊 Clinical Intelligence Dashboard (`/`)
- **Metric Cards:** Real-time counts for Active Doctors, Registered Patients, and System Personnel.
- **Patient Registration Flow Chart:** Monthly admission trends across recent months with custom dark tooltips.
- **Specialist Workload Bar Chart:** Patient distribution breakdown per physician.
- **Disease Distribution Breakdown:** Diagnosis progress meters and percentage telemetry.

### 3. 🩺 Medical Specialists Directory (`/doctors` & `/doctors/[id]`)
- Real-time search across doctor name, medical specialty, and chamber location.
- Register new doctors and update profiles with validation.
- Delete doctors with custom confirmation dialogs.
- Detailed single physician page (`/doctors/[id]`) displaying:
  - Doctor credentials and contact information.
  - Sub-table of patients assigned exclusively to that physician.
  - Ability to admit new patients directly under that doctor.

### 4. 🏥 Dedicated Patient Registry (`/patients`)
- Server-side pagination with controls (Previous, Next, Page X of Y, Total records).
- Instant search filter by patient name or diagnosis.
- Dual dropdown filters: filter by Medical Diagnosis and filter by Assigned Specialist.
- Admit new patient modal dialog with dynamic doctor picker.
- Discharge / delete patient with confirmation modal.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Data Fetching & Cache:** TanStack Query (React Query v5)
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **Charts:** Recharts
- **Toast Notifications:** Sonner
- **HTTP Client:** Axios with response interceptors
- **Styling:** Tailwind CSS + Radix UI Primitives

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=https://doctormanagementbackend.vercel.app/api/v1
NEXT_PUBLIC_APP_NAME="Doctor Tracker"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔑 Demo Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@doctortracker.com` | `Admin@123456` |
| **Staff** | `staff@doctortracker.com` | `Staff@123456` |

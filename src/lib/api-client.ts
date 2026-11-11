import axios from "axios";
import Cookies from "js-cookie";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://doctormanagementbackend.vercel.app/api/v1";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token if present
apiClient.interceptors.request.use(
  (config) => {
    const token =
      Cookies.get("token") ||
      (typeof window !== "undefined" ? localStorage.getItem("token") : null);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors & session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    if (error.response?.status === 401 && typeof window !== "undefined") {
      Cookies.remove("token");
      Cookies.remove("userRole");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(new Error(message));
  }
);

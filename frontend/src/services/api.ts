import axios, { type AxiosError } from "axios";
import type { AdminUser } from "../types/auth";
import type { Analytics, BloodRequest, Donor, Hospital, MatchResponse } from "../types";

const STORAGE_KEY = "hemolink_admin_token";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  unauthorizedHandler = handler;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem(STORAGE_KEY, token);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function clearAuthToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

api.interceptors.request.use((config) => {
  const t = getStoredToken();
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status;
    const reqUrl = error.config?.url ?? "";
    if (status === 401) {
      if (reqUrl.includes("/auth/login") || reqUrl.includes("/auth/me") || reqUrl.includes("/auth/register")) {
        return Promise.reject(error);
      }
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export async function registerDonor(payload: {
  name: string;
  bloodType: string;
  location: string;
  phone: string;
}): Promise<Donor> {
  const { data } = await api.post<Donor>("/donors", payload);
  return data;
}

export async function fetchDonors(search?: string): Promise<Donor[]> {
  const { data } = await api.get<Donor[]>("/donors", {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function createBloodRequest(payload: {
  hospitalName: string;
  bloodType: string;
  unitsNeeded: number;
  location: string;
}): Promise<BloodRequest> {
  const { data } = await api.post<BloodRequest>("/requests", payload);
  return data;
}

export async function fetchRequests(search?: string): Promise<BloodRequest[]> {
  const { data } = await api.get<BloodRequest[]>("/requests", {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function fetchHospitals(search?: string): Promise<Hospital[]> {
  const { data } = await api.get<Hospital[]>("/hospitals", {
    params: search ? { search } : undefined,
  });
  return data;
}

export async function createHospital(payload: {
  name: string;
  location: string;
  phone: string;
  contactName?: string | null;
}): Promise<Hospital> {
  const { data } = await api.post<Hospital>("/hospitals", payload);
  return data;
}

export async function matchDonors(payload: { bloodType: string; location: string }): Promise<MatchResponse> {
  const { data } = await api.post<MatchResponse>("/match", payload);
  return data;
}

export async function fetchAnalytics(): Promise<Analytics> {
  const { data } = await api.get<Analytics>("/analytics");
  return data;
}

export async function patchAdminProfile(payload: {
  currentPassword: string;
  email?: string;
  newPassword?: string;
  displayName?: string | null;
}): Promise<{ token: string; admin: AdminUser }> {
  const { data } = await api.patch<{ token: string; admin: AdminUser }>("/auth/profile", payload);
  return data;
}

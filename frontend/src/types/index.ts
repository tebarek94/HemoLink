export interface Donor {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  phone: string;
  lastDonation: string | null;
  createdAt: string;
  eligible?: boolean;
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  bloodType: string;
  unitsNeeded: number;
  location: string;
  createdAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  phone: string;
  contactName: string | null;
  createdAt: string;
}

export interface MatchResponse {
  matchedDonors: Donor[];
  count: number;
  message: string;
}

export interface Analytics {
  totalDonors: number;
  totalRequests: number;
}

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodType = (typeof BLOOD_TYPES)[number];

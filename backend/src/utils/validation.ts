import { z } from "zod";

export const createDonorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  lastDonation: z.coerce.date().optional().nullable(),
});

export const createRequestSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  unitsNeeded: z.coerce.number().int().positive(),
  location: z.string().min(1, "Location is required"),
});

export const matchSchema = z.object({
  bloodType: z.string().min(1, "Blood type is required"),
  location: z.string().min(1, "Location is required"),
});

export const createHospitalSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone is required"),
  contactName: z.string().optional().nullable(),
});

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type MatchInput = z.infer<typeof matchSchema>;
export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;

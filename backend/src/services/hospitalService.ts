import type { Hospital } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import type { CreateHospitalInput } from "../utils/validation.js";

export async function createHospital(data: CreateHospitalInput): Promise<Hospital> {
  return prisma.hospital.create({
    data: {
      name: data.name.trim(),
      location: data.location.trim(),
      phone: data.phone.trim(),
      contactName: data.contactName?.trim() || null,
    },
  });
}

export async function listHospitals(search?: string): Promise<Hospital[]> {
  const q = search?.trim();
  if (!q) {
    return prisma.hospital.findMany({ orderBy: { createdAt: "desc" } });
  }
  return prisma.hospital.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { contactName: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

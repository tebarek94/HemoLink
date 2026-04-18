import type { Donor } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import type { CreateDonorInput } from "../utils/validation.js";

export async function createDonor(data: CreateDonorInput): Promise<Donor> {
  return prisma.donor.create({
    data: {
      name: data.name,
      bloodType: data.bloodType,
      location: data.location,
      phone: data.phone,
      lastDonation: data.lastDonation ?? null,
    },
  });
}

export async function listDonors(search?: string): Promise<Donor[]> {
  const q = search?.trim();
  if (!q) {
    return prisma.donor.findMany({ orderBy: { createdAt: "desc" } });
  }
  return prisma.donor.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
        { bloodType: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

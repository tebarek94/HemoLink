import type { Request as BloodRequest } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import type { CreateRequestInput } from "../utils/validation.js";

export async function createRequest(data: CreateRequestInput): Promise<BloodRequest> {
  return prisma.request.create({
    data: {
      hospitalName: data.hospitalName,
      bloodType: data.bloodType,
      unitsNeeded: data.unitsNeeded,
      location: data.location,
    },
  });
}

export async function listRequests(search?: string): Promise<BloodRequest[]> {
  const q = search?.trim();
  if (!q) {
    return prisma.request.findMany({ orderBy: { createdAt: "desc" } });
  }
  return prisma.request.findMany({
    where: {
      OR: [
        { hospitalName: { contains: q, mode: "insensitive" } },
        { location: { contains: q, mode: "insensitive" } },
        { bloodType: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
}

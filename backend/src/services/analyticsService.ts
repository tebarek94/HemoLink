import { prisma } from "../prisma/client.js";

export async function getCounts(): Promise<{ totalDonors: number; totalRequests: number }> {
  const [totalDonors, totalRequests] = await Promise.all([
    prisma.donor.count(),
    prisma.request.count(),
  ]);
  return { totalDonors, totalRequests };
}

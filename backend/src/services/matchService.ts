import type { Donor } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { isEligible } from "../utils/eligibility.js";
import type { MatchInput } from "../utils/validation.js";

export type MatchedDonor = Donor & { eligible: boolean };

export interface MatchResult {
  matchedDonors: MatchedDonor[];
  count: number;
  message: string;
}

export async function findMatchingDonors(input: MatchInput): Promise<MatchResult> {
  const candidates = await prisma.donor.findMany({
    where: {
      bloodType: input.bloodType,
      location: input.location,
    },
    orderBy: { createdAt: "desc" },
  });

  const matchedDonors: MatchedDonor[] = candidates
    .map((d) => ({
      ...d,
      eligible: isEligible(d.lastDonation),
    }))
    .filter((d) => d.eligible);

  const count = matchedDonors.length;
  const message =
    count === 0
      ? "Alert sent to 0 eligible donors"
      : count === 1
        ? "Alert sent to 1 eligible donor"
        : `Alert sent to ${count} eligible donors`;

  return { matchedDonors, count, message };
}

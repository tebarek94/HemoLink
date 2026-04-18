const MS_PER_DAY = 86_400_000;
export const DONATION_COOLDOWN_DAYS = 56;

export function isEligible(lastDonation: Date | null | undefined): boolean {
  if (lastDonation == null) return true;
  const diffMs = Date.now() - lastDonation.getTime();
  return diffMs >= DONATION_COOLDOWN_DAYS * MS_PER_DAY;
}

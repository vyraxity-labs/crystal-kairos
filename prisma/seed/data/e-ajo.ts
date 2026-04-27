import { EAjoDuration, EAjoFrequency } from '@/generated/prisma/enums'

export const eAjo = [
  {
    contributionAmount: 10000,
    totalParticipants: 10,
    duration: EAjoDuration.FOUR_MONTHS,
    frequency: EAjoFrequency.MONTHLY,
    payoutPosition: 1,
    feePercentage: 0.1,
    feeAmount: 1000,
    totalExpectedPayout: 10000,
    netPayoutAmount: 9000,
  },
  {
    contributionAmount: 10000,
    totalParticipants: 10,
    duration: EAjoDuration.SIX_MONTHS,
    frequency: EAjoFrequency.MONTHLY,
    payoutPosition: 2,
    feePercentage: 0.1,
    feeAmount: 1000,
    totalExpectedPayout: 10000,
    netPayoutAmount: 9000,
  },
  {
    contributionAmount: 10000,
    totalParticipants: 10,
    duration: EAjoDuration.TWELVE_MONTHS,
    frequency: EAjoFrequency.MONTHLY,
    payoutPosition: 3,
    feePercentage: 0.1,
    feeAmount: 1000,
    totalExpectedPayout: 10000,
    netPayoutAmount: 9000,
  },
]

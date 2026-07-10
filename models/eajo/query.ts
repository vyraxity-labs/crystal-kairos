import { prisma } from '@/lib/prisma'
import { EAjoDuration } from '@/generated/prisma/enums'

const durationMonthsMap: Record<EAjoDuration, number> = {
  [EAjoDuration.FOUR_MONTHS]: 4,
  [EAjoDuration.SIX_MONTHS]: 6,
  [EAjoDuration.TWELVE_MONTHS]: 12,
}

export const getEAjoById = async (ajoId: string) => {
  try {
    const ajo = await prisma.eAjo.findUnique({
      where: { id: ajoId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
    return { success: true, data: ajo }
  } catch (error) {
    return { success: false, error: error as Error }
  }
}

export const getAjoFeeConfigsForDuration = async (duration: EAjoDuration) => {
  try {
    const months = durationMonthsMap[duration]
    const configs = await prisma.ajoFeeConfig.findMany({
      where: { durationMonths: months },
      orderBy: { pickPosition: 'asc' },
    })
    return { success: true, data: configs }
  } catch (error) {
    return { success: false, data: [], error: error as Error }
  }
}

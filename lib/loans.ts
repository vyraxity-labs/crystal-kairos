interface Installment {
  installmentNumber: number
  dueDate: Date
  principalAmount: number
  interestAmount: number
  totalAmount: number
  status: 'PAID' | 'PENDING' | 'OVERDUE'
}

// Helper to serialize Decimal fields to numbers to prevent RSC boundary serialization errors
export const serializeLoan = (loan: any) => {
  if (!loan) return null
  return {
    ...loan,
    requestedAmount: Number(loan.requestedAmount),
    approvedAmount: loan.approvedAmount ? Number(loan.approvedAmount) : null,
    interestRate: Number(loan.interestRate),
    applicationFee: Number(loan.applicationFee),
    outstandingBalance: Number(loan.outstandingBalance),
    totalRepaid: Number(loan.totalRepaid),
    defaultPenalty: Number(loan.defaultPenalty),
  }
}

export const serializeTransaction = (tx: any) => {
  if (!tx) return null
  return {
    ...tx,
    amount: Number(tx.amount),
  }
}

/**
 * Calculates a standard loan amortization schedule based on simple cooperative interest
 */
export const calculateRepaymentSchedule = (
  approvedAmount: number,
  interestRatePct: number,
  durationMonths: number,
  startDate: Date | null,
  totalRepaid: number,
  gracePeriodDays: number = 7
): Installment[] => {
  const schedule: Installment[] = []
  if (durationMonths <= 0 || approvedAmount <= 0) return schedule

  const baseDate = startDate ? new Date(startDate) : new Date()
  
  const monthlyPrincipal = approvedAmount / durationMonths
  const monthlyInterest = (approvedAmount * interestRatePct) / 100
  const installmentTotal = monthlyPrincipal + monthlyInterest

  let runningRepaid = totalRepaid

  for (let i = 1; i <= durationMonths; i++) {
    const dueDate = new Date(baseDate)
    dueDate.setMonth(baseDate.getMonth() + i)

    // Acknowledge payment allocation: if runningRepaid is enough to cover this installment
    let status: 'PAID' | 'PENDING' | 'OVERDUE' = 'PENDING'
    if (runningRepaid >= installmentTotal) {
      status = 'PAID'
      runningRepaid -= installmentTotal
    } else {
      const graceLimit = new Date(dueDate)
      graceLimit.setDate(dueDate.getDate() + gracePeriodDays)
      if (new Date() > graceLimit) {
        status = 'OVERDUE'
      }
    }

    schedule.push({
      installmentNumber: i,
      dueDate,
      principalAmount: monthlyPrincipal,
      interestAmount: monthlyInterest,
      totalAmount: installmentTotal,
      status,
    })
  }

  return schedule
}

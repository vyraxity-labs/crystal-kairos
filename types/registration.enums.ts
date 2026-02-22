/**
 * Shared registration enums - safe for client components.
 * Values must match Prisma schema for server-side compatibility.
 * Do NOT import Prisma in client components - use these instead.
 */

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const
export type Gender = (typeof Gender)[keyof typeof Gender]

export const Relationship = {
  SPOUSE: 'SPOUSE',
  SIBLING: 'SIBLING',
  PARENT: 'PARENT',
  CHILD: 'CHILD',
  FRIEND: 'FRIEND',
  COLLEAGUE: 'COLLEAGUE',
  NEIGHBOR: 'NEIGHBOR',
  ACQUAINTANCE: 'ACQUAINTANCE',
  RELATIVE: 'RELATIVE',
  EMPLOYER: 'EMPLOYER',
  EMPLOYEE: 'EMPLOYEE',
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  SUPPLIER: 'SUPPLIER',
  PARTNER: 'PARTNER',
  CLIENT: 'CLIENT',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
  GUEST: 'GUEST',
  OTHER: 'OTHER',
} as const
export type Relationship = (typeof Relationship)[keyof typeof Relationship]

export const MembershipInterest = {
  AJO: 'AJO',
  SAVINGS: 'SAVINGS',
  LOAN: 'LOAN',
} as const
export type MembershipInterest =
  (typeof MembershipInterest)[keyof typeof MembershipInterest]

export const Assumptions = {
  HAS_SMART_PHONE: 'HAS_SMART_PHONE',
  HAS_INTEGRITY: 'HAS_INTEGRITY',
  IS_TRUSTWORTHY: 'IS_TRUSTWORTHY',
  HAS_INTERNET_ACCESS: 'HAS_INTERNET_ACCESS',
  HAS_EMAIL: 'HAS_EMAIL',
  HAS_WHATS_APP: 'HAS_WHATS_APP',
} as const
export type Assumptions = (typeof Assumptions)[keyof typeof Assumptions]

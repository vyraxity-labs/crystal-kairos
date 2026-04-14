import {
  Assumptions,
  Gender,
  MembershipInterest,
  Relationship,
} from '@/generated/prisma/enums'

export const genderData = [
  {
    id: 'male',
    label: 'register.form.personal_details.gender_male',
    value: Gender.MALE,
  },
  {
    id: 'female',
    label: 'register.form.personal_details.gender_female',
    value: Gender.FEMALE,
  },
]

export const relationshipData = [
  {
    id: 'spouse',
    label: 'register.form.next_of_kin.relationships.spouse',
    value: Relationship.SPOUSE,
  },
  {
    id: 'sibling',
    label: 'register.form.next_of_kin.relationships.sibling',
    value: Relationship.SIBLING,
  },
  {
    id: 'parent',
    label: 'register.form.next_of_kin.relationships.parent',
    value: Relationship.PARENT,
  },
  {
    id: 'child',
    label: 'register.form.next_of_kin.relationships.child',
    value: Relationship.CHILD,
  },
  {
    id: 'friend',
    label: 'register.form.next_of_kin.relationships.friend',
    value: Relationship.FRIEND,
  },
  {
    id: 'colleague',
    label: 'register.form.next_of_kin.relationships.colleague',
    value: Relationship.COLLEAGUE,
  },
  {
    id: 'neighbor',
    label: 'register.form.next_of_kin.relationships.neighbor',
    value: Relationship.NEIGHBOR,
  },
  {
    id: 'acquaintance',
    label: 'register.form.next_of_kin.relationships.acquaintance',
    value: Relationship.ACQUAINTANCE,
  },
  {
    id: 'relative',
    label: 'register.form.next_of_kin.relationships.relative',
    value: Relationship.RELATIVE,
  },
  {
    id: 'employer',
    label: 'register.form.next_of_kin.relationships.employer',
    value: Relationship.EMPLOYER,
  },
  {
    id: 'employee',
    label: 'register.form.next_of_kin.relationships.employee',
    value: Relationship.EMPLOYEE,
  },
  {
    id: 'other',
    label: 'register.form.next_of_kin.relationships.other',
    value: Relationship.OTHER,
  },
]

export const interestsData = [
  {
    id: 'eajo',
    label: 'register.form.interests.e_ajo',
    description: 'register.form.interests.e_ajo_description',
    value: MembershipInterest.E_AJO,
  },
  {
    id: 'savings',
    label: 'register.form.interests.savings',
    description: 'register.form.interests.savings_description',
    value: MembershipInterest.SAVINGS,
  },
  {
    id: 'loans',
    label: 'register.form.interests.loans',
    description: 'register.form.interests.loans_description',
    value: MembershipInterest.LOAN,
  },
]

export const assumptionsData = [
  {
    id: 'has-smart-phone',
    label: 'register.form.interests.assumptions.has-smart-phone',
    value: Assumptions.HAS_SMART_PHONE,
  },
  {
    id: 'has-integrity',
    label: 'register.form.interests.assumptions.has-integrity',
    value: Assumptions.HAS_INTEGRITY,
  },
  {
    id: 'is-trustworthy',
    label: 'register.form.interests.assumptions.is-trustworthy',
    value: Assumptions.IS_TRUSTWORTHY,
  },
  {
    id: 'has-internet-access',
    label: 'register.form.interests.assumptions.has-internet-access',
    value: Assumptions.HAS_INTERNET_ACCESS,
  },
  {
    id: 'has-email',
    label: 'register.form.interests.assumptions.has-email',
    value: Assumptions.HAS_EMAIL,
  },
  {
    id: 'has-whats-app',
    label: 'register.form.interests.assumptions.has-whats-app',
    value: Assumptions.HAS_WHATS_APP,
  },
]

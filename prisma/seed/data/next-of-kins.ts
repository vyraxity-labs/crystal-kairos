import { Relationship } from '@/generated/prisma/enums'

export const nextOfKins = [
  {
    name: 'Mary Doe',
    phoneNumber: '+2348011111111',
    relationship: Relationship.SPOUSE,
    bankName: 'GTBank',
    accountNumber: '0111111111',
    accountName: 'Mary Doe',
    occupation: 'Nurse',
    address: '123 Main Street, Lagos',
  },
  {
    name: 'Bob Smith',
    phoneNumber: '+2348022222222',
    relationship: Relationship.SIBLING,
    bankName: 'UBA',
    accountNumber: '0222222222',
    accountName: 'Bob Smith',
    occupation: 'Business Owner',
    address: '456 Oak Avenue, Abuja',
  },
  {
    name: 'Harry Potter',
    phoneNumber: '+2348033333333',
    relationship: Relationship.PARENT,
    bankName: 'GTBank',
    accountNumber: '0333333333',
    accountName: 'Harry Potter',
    occupation: 'Teacher',
    address: '789 Pine Road, Port Harcourt',
  },
  {
    name: 'Hermione Granger',
    phoneNumber: '+2348044444444',
    relationship: Relationship.PARENT,
    bankName: 'Access Bank',
    accountNumber: '0444444444',
    accountName: 'Hermione Granger',
    occupation: 'Doctor',
    address: '101 Maple Street, Enugu',
  },
]

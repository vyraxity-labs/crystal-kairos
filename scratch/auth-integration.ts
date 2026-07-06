import { prisma } from '../lib/prisma'
import { register } from '../models/auth/query'
import { approveMember } from '../models/members/query'
import { verifyPasswordSetToken, setPassword } from '../models/auth/query'
import { MembershipStatus } from '../generated/prisma/enums'
import bcrypt from 'bcryptjs'

async function runTest() {
  console.log('🔄 Starting Member Sign-Up, Verification, and Activation Integration Test...')

  // Define unique test email
  const testEmail = `testuser_${Date.now()}@example.com`

  // 1. Register a test user
  const personalInfo = {
    name: 'Test Member',
    email: testEmail,
    address: '123 Test Street, Lagos',
    dateOfBirth: '2000-01-01',
    gender: 'MALE' as const,
    phoneNumber: '+2348011112222',
    occupation: 'Software Engineer',
  }

  const bankInfo = {
    bankName: 'Access Bank',
    accountNumber: '0123456789',
    accountName: 'Test Member',
  }

  const nextOfKin = {
    name: 'Test Kin',
    phoneNumber: '+2348033334444',
    relationship: 'SPOUSE' as const,
    occupation: 'Doctor',
    address: '456 Kin Lane, Lagos',
    bankName: 'GTBank',
    accountNumber: '9876543210',
    accountName: 'Test Kin',
  }

  const membershipInfo = {
    interests: ['E_AJO' as const, 'SAVINGS' as const],
    referralName: 'Jane Smith',
    referralPhoneNumber: '+2348022223333',
    assumptions: [
      'HAS_SMART_PHONE' as const,
      'HAS_INTEGRITY' as const,
      'IS_TRUSTWORTHY' as const,
      'HAS_INTERNET_ACCESS' as const,
      'HAS_EMAIL' as const,
      'HAS_WHATS_APP' as const,
    ],
  }

  const reviewAndSubmit = {
    termsAndConditions: true,
  }

  console.log('1. Registering user...');
  const regResult = await register(
    personalInfo,
    bankInfo,
    nextOfKin,
    membershipInfo,
    reviewAndSubmit
  )

  if (!regResult.success || !regResult.user) {
    throw new Error(`Registration failed: ${regResult.error}`)
  }
  console.log('✅ User registered successfully. ID:', regResult.user.id)

  // Verify created structures in DB
  const userInDb = await prisma.user.findUnique({
    where: { id: regResult.user.id },
    include: {
      userInfo: true,
      membership: true,
      bankAccounts: true,
      nextOfKin: true,
    }
  })

  if (!userInDb || !userInDb.membership || !userInDb.userInfo) {
    throw new Error('User structures not properly created in DB')
  }

  console.log('✅ Checked database structures.')
  console.log('Membership status after signup:', userInDb.membership.status)
  if (userInDb.membership.status !== MembershipStatus.PENDING) {
    throw new Error(`Expected PENDING membership status, got: ${userInDb.membership.status}`)
  }

  // 2. Fetch admin user to perform approval
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!admin) {
    throw new Error('Admin user not found in database')
  }

  console.log('2. Approving membership by Admin:', admin.email)
  const approvalResult = await approveMember(userInDb.id, admin.id, userInDb.email)
  if (!approvalResult.success || !approvalResult.data) {
    throw new Error(`Approval failed: ${approvalResult.error}`)
  }

  // Reload user and verify membership number is generated
  const approvedUser = await prisma.user.findUnique({
    where: { id: userInDb.id },
    include: { membership: true }
  })
  
  if (!approvedUser?.membership || approvedUser.membership.status !== MembershipStatus.APPROVED) {
    throw new Error('User membership not updated to APPROVED')
  }
  console.log('✅ User approved. Membership Number:', approvedUser.membership.membershipNumber)

  // 3. We will sign user to get verification token (simulating email dispatch)
  console.log('3. Simulating email activation link...')
  const { signUser } = await import('../models/auth/query')
  const signResult = await signUser(userInDb.id, userInDb.email)
  if (!signResult.success || !signResult.token) {
    throw new Error(`Token generation failed: ${signResult.error}`)
  }
  const activationToken = signResult.token
  console.log('✅ Simulated Activation Link Token:', activationToken.substring(0, 20) + '...')

  // 4. Verify password set token
  console.log('4. Verifying activation token...')
  const tokenVerifyResult = await verifyPasswordSetToken(activationToken)
  if (!tokenVerifyResult.success || !tokenVerifyResult.data) {
    throw new Error(`Token verification failed: ${tokenVerifyResult.error}`)
  }
  console.log('✅ Token verified successfully. Email inside token:', tokenVerifyResult.data.userEmail)

  // 5. Submit setPassword
  console.log('5. Setting password...')
  const newPassword = 'SecurePassword123!'
  const setPassResult = await setPassword({
    email: userInDb.email,
    password: newPassword,
    confirmPassword: newPassword
  }, activationToken)

  if (!setPassResult.success || !setPassResult.data) {
    throw new Error(`Password set failed: ${setPassResult.error}`)
  }
  console.log('✅ Password set successfully.')

  // 6. Verify password in DB
  const finalUser = await prisma.user.findUnique({
    where: { id: userInDb.id }
  })

  if (!finalUser || !finalUser.passwordHash || !finalUser.hasSetPassword) {
    throw new Error('User passwordHash or hasSetPassword flag not updated in DB')
  }

  const isPasswordMatch = await bcrypt.compare(newPassword, finalUser.passwordHash)
  if (!isPasswordMatch) {
    throw new Error('Encryption verify failed: BCrypt password mismatch')
  }

  console.log('✅ Final Database Checks: hasSetPassword =', finalUser.hasSetPassword)
  console.log('🎉 MEMBER SIGN-UP, VERIFICATION, AND ACTIVATION INTEGRATION TEST PASSED SUCCESSFULLY!')
}

runTest()
  .catch((err) => {
    console.error('❌ Integration Test Failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

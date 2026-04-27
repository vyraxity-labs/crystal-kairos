import { auth } from '@/auth'
import Details from '@/components/admin/members/Details'
import DetailsHeader from '@/components/admin/members/DetailsHeader'
import { Button } from '@/components/ui/button'
import { MembershipStatus, MembershipTier } from '@/generated/prisma/enums'
import { getMemberById } from '@/models/members/query'
import Link from 'next/link'

const MemberDetailsPage = async ({
  params,
}: {
  params: Promise<{ memberId: string }>
}) => {
  const { memberId } = await params
  const memberDetails = (await getMemberById(memberId)).data
  const session = await auth()

  if (!session) return null

  const adminId = session.user.id

  if (!memberDetails) {
    return (
      <div className='flex flex-col justify-center items-center gap-5'>
        <p>Member not found</p>
        <Button asChild className='text-on-primary rounded-sm'>
          <Link href='/admin/members'>Back to Members List</Link>
        </Button>
      </div>
    )
  }

  const nextOfKin = memberDetails.nextOfKin

  return (
    <div>
      <DetailsHeader
        name={memberDetails.name}
        membershipNumber={memberDetails.membership?.membershipNumber ?? null}
        status={memberDetails.membership?.status ?? MembershipStatus.PENDING}
        userId={memberDetails.id}
        adminId={adminId}
        userEmail={memberDetails.email}
      />
      <Details
        personalInfo={{
          name: memberDetails.name,
          email: memberDetails.email,
          address: memberDetails.userInfo?.address,
          phone: memberDetails.userInfo?.phoneNumber,
          dateOfBirth: memberDetails.userInfo?.dateOfBirth,
          gender: memberDetails.userInfo?.gender,
          occupation: memberDetails.userInfo?.occupation,
        }}
        bankInfo={memberDetails.bankAccounts}
        tier={memberDetails.membership?.tier ?? MembershipTier.MEMBER}
        nextOfKinInfo={{
          name: memberDetails.nextOfKin?.name,
          accountName: nextOfKin?.accountName,
          accountNumber: nextOfKin?.accountNumber,
          address: nextOfKin?.address,
          bankName: nextOfKin?.bankName,
          occupation: nextOfKin?.occupation,
          phoneNumber: nextOfKin?.phoneNumber,
          relationship: nextOfKin?.relationship,
        }}
        rejectionReason={memberDetails.membership?.rejectionReason || ''}
        isRejected={
          memberDetails.membership?.status === MembershipStatus.REJECTED
        }
      />
    </div>
  )
}

export default MemberDetailsPage

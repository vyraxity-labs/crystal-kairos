import SetPasswordForm from '@/components/auth/SetPasswordForm'
import { verifyPasswordSetToken } from '@/models/auth/query'
import { redirect } from 'next/navigation'

const SetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const token = (await searchParams).token
  if (!token || Array.isArray(token)) {
    return (
      <div className='h-full flex-1 flex justify-center items-center'>
        Missing token
      </div>
    )
  }

  const data = await verifyPasswordSetToken(token)

  if (data.redirect) {
    redirect(data.redirect)
  }

  if (data.error || !data.data) {
    return (
      <div className='h-full flex-1 flex justify-center items-center'>
        Invalid or Expired token
      </div>
    )
  }

  return (
    <div className='h-full flex-1 flex justify-center items-center'>
      <SetPasswordForm email={data.data.userEmail} token={token} />
    </div>
  )
}

export default SetPasswordPage

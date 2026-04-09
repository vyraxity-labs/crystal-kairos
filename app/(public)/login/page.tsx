import LoginBanner from '@/components/auth/LoginBanner'
import LoginForm from '@/components/auth/LoginForm'

const LoginPage = () => {
  return (
    <div className='flex-1 md:grid md:grid-cols-[1.2fr_1fr] flex flex-col'>
      <LoginBanner />

      <LoginForm />
    </div>
  )
}

export default LoginPage

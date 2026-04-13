import RegisterPageHead from '@/components/auth/RegisterPageHead'
import RegisterStepsHeader from '@/components/auth/RegisterStepsHeader'
import RegistrationForm from '@/components/auth/RegistrationForm'

const RegisterPage = () => {
  return (
    <div className='py-8'>
      <div className='flex flex-col items-center w-[90%] mx-auto'>
        <RegisterPageHead />

        <div className='w-full flex flex-col gap-8 max-w-[700px]'>
          <RegisterStepsHeader />
          <RegistrationForm />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

'use client'

import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import Step1PersonalInfo from './steps/Step1PersonalInfo'
import Step2BankDetails from './steps/Step2BankDetails'
import Step3NextOfKin from './steps/Step3NextOfKin'
import Step4Interests from './steps/Step4Interests'
import Step5Review from './steps/Step5Review'

const STEPS = [
  Step1PersonalInfo,
  Step2BankDetails,
  Step3NextOfKin,
  Step4Interests,
  Step5Review,
]

const RegistrationForm = () => {
  const currentStep = useSelector((s: RootState) => s.registration.currentStep)
  const StepComponent = STEPS[currentStep]

  return <StepComponent />
}

export default RegistrationForm

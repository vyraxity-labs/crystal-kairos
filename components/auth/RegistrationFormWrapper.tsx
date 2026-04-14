import { ReactNode } from 'react'
import { Card } from '../ui/card'

const RegistrationFormWrapper = ({
  children,
  currentStep,
}: {
  children: ReactNode
  currentStep: number
}) => {
  if (currentStep === 5) {
    return <div>{children}</div>
  }
  return <Card className='rounded-md'>{children}</Card>
}

export default RegistrationFormWrapper

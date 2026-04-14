'use client'

import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { RootState } from '@/store'
import { useEffect, useMemo } from 'react'
import { registerStepsHeaderData } from './data'
import { useTranslation } from 'react-i18next'
import { MoveLeft, MoveRight } from 'lucide-react'
import {
  bankInfoSchema,
  membershipInfoSchema,
  nextOfKinSchema,
  personalInfoSchema,
  reviewAndSubmitSchema,
} from '@/schema/auth.schema'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import {
  type RegistrationFormValues,
  type RegistrationStepSchema,
} from '@/types/register.interface'
import PersonalInfo from './registration-steps/PersonalInfo'
import {
  setCurrentStep,
  setStep1,
  setStep2,
  setStep3,
  setStep4,
  setStep5,
  setStepsState,
} from '@/store/register.store'
import BankingDetails from './registration-steps/BankingDetails'
import NextOfKin from './registration-steps/NextOfKin'
import Interests from './registration-steps/Interests'
import Review from './registration-steps/Review'
import { register } from '@/models/auth'
import { toast } from 'sonner'

const RegistrationForm = () => {
  const { currentStep, stepsState, step1, step2, step3, step4, step5 } =
    useSelector((store: RootState) => store.register)
  const { t } = useTranslation('auth')
  const dispatch = useDispatch()

  const { stepInfo, currentSchema } = useMemo(() => {
    const stepInfo =
      registerStepsHeaderData.find((item) => item.step === currentStep) ||
      registerStepsHeaderData[0]

    let currentSchema: RegistrationStepSchema = personalInfoSchema
    switch (currentStep) {
      case 1:
        currentSchema = personalInfoSchema
        break
      case 2:
        currentSchema = bankInfoSchema
        break
      case 3:
        currentSchema = nextOfKinSchema
        break
      case 4:
        currentSchema = membershipInfoSchema
        break
      case 5:
        currentSchema = reviewAndSubmitSchema
        break
      default:
        currentSchema = personalInfoSchema
        break
    }

    return { stepInfo, currentSchema }
  }, [currentStep])

  const stepDefaultValues = useMemo(() => {
    switch (currentStep) {
      case 1: {
        const raw = step1.data.dateOfBirth
        const parsed = raw ? new Date(raw) : new Date()
        const dateOfBirth = Number.isNaN(parsed.getTime()) ? new Date() : parsed
        return {
          ...step1.data,
          dateOfBirth,
        } as Partial<RegistrationFormValues>
      }
      case 2:
        return { ...step2.data } as Partial<RegistrationFormValues>
      case 3:
        return { ...step3.data } as Partial<RegistrationFormValues>
      case 4:
        return { ...step4.data } as Partial<RegistrationFormValues>
      case 5:
        return { ...step5.data } as Partial<RegistrationFormValues>
      default:
        return {} as Partial<RegistrationFormValues>
    }
  }, [currentStep, step1.data, step2.data, step3.data, step4.data, step5.data])

  const {
    handleSubmit,
    control,
    formState: { isValid },
    setValue,
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: standardSchemaResolver(currentSchema as never),
    mode: 'onSubmit',
    defaultValues: stepDefaultValues,
  })

  useEffect(() => {
    reset(stepDefaultValues)
  }, [reset, stepDefaultValues])

  const getValues = (
    formData: RegistrationFormValues,
    step: Record<string, unknown>,
  ) => {
    const temp: Record<string, unknown> = { ...step }

    for (const key of Object.keys(temp)) {
      if (key in formData) {
        let value = (formData as Record<string, unknown>)[key]
        if (value instanceof Date) {
          value = value.toISOString()
        }
        temp[key] = value
      }
    }

    return temp
  }

  const setStep = <
    TStep extends { data: Record<string, unknown>; hasErrors: boolean },
  >(
    setStepAction: (v: TStep) => { payload: TStep; type: string },
    data: TStep['data'],
    currentStep: number,
  ) => {
    dispatch(setStepAction({ data: { ...data }, hasErrors: false } as TStep))
    dispatch(
      setStepsState({ ...stepsState, [currentStep]: { hasErrors: false } }),
    )
  }

  const onSubmit = async (formData: RegistrationFormValues) => {
    // console.log(formData)
    if (isValid) {
      if (currentStep < 5) {
        dispatch(setCurrentStep(currentStep + 1))
      } else {
        // console.log(step1.data, step2.data, step3.data, step4.data, step5.data)
        const response = await register(
          step1.data,
          step2.data,
          step3.data,
          step4.data,
          step5.data,
        )

        if (!response.success || response.error) {
          toast.error(response.error)
        }

        if (response.success) {
          toast.success('Registration successful')
        }
      }
      switch (currentStep) {
        case 1:
          setStep(
            setStep1,
            getValues(formData, step1.data) as typeof step1.data,
            currentStep,
          )
          break
        case 2:
          setStep(
            setStep2,
            getValues(formData, step2.data) as typeof step2.data,
            currentStep,
          )
          break
        case 3:
          setStep(
            setStep3,
            getValues(formData, step3.data) as typeof step3.data,
            currentStep,
          )
          break
        case 4:
          setStep(
            setStep4,
            getValues(formData, step4.data) as typeof step4.data,
            currentStep,
          )
          break
        case 5:
          setStep(
            setStep5,
            getValues(formData, step5.data) as typeof step5.data,
            currentStep,
          )
          break
        default:
          setStep(
            setStep1,
            getValues(formData, step1.data) as typeof step1.data,
            currentStep,
          )
          break
      }
    }
  }

  return (
    <Card className='rounded-md'>
      <CardHeader>
        <CardTitle>{t(stepInfo.label)}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-8'>
        <CardContent>
          {currentStep === 1 && (
            <PersonalInfo control={control} onDateSelected={setValue} />
          )}
          {currentStep === 2 && <BankingDetails control={control} />}
          {currentStep === 3 && <NextOfKin control={control} />}
          {currentStep === 4 && <Interests control={control} />}
          {currentStep === 5 && <Review control={control} />}
        </CardContent>

        <CardFooter className='flex justify-between'>
          <Button
            type='button'
            variant='ghost'
            className='cursor-pointer disabled:opacity-0'
            disabled={currentStep === 1}
            onClick={() => dispatch(setCurrentStep(currentStep - 1))}
          >
            <MoveLeft /> {t('register.form.buttons.back')}
          </Button>
          <Button
            type='submit'
            className='rounded-sm text-on-primary cursor-pointer'
          >
            {t(
              currentStep === 5
                ? 'register.form.buttons.submit'
                : 'register.form.buttons.continue',
            )}{' '}
            <MoveRight />
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default RegistrationForm

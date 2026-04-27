'use client'

import { SetPasswordFormSchema, setPasswordSchema } from '@/schema/auth.schema'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Controller, useForm } from 'react-hook-form'
import { Field, FieldError, FieldLabel } from '../ui/field'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import Link from 'next/link'
import { setPassword } from '@/models/auth/query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { REDIRECT_DELAY } from '@/lib/constants'

const SetPasswordForm = ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  const { t } = useTranslation('auth')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { control, handleSubmit } = useForm<SetPasswordFormSchema>({
    mode: 'onChange',
    resolver: standardSchemaResolver(setPasswordSchema),
    defaultValues: {
      email,
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (formData: SetPasswordFormSchema) => {
    setIsLoading(true)
    const response = await setPassword(formData, token)
    setIsLoading(false)

    if (response.error) {
      toast.error(response.error.toString())
      return
    }

    if (response.success) {
      toast.success(
        t('set_password.success', { seconds: REDIRECT_DELAY / 1000 }),
      )
      setTimeout(() => {
        router.replace('/login')
      }, REDIRECT_DELAY)
    }
  }

  return (
    <div className='w-[90%] max-w-[600px]'>
      <Card className='rounded-md'>
        <CardHeader>
          <CardTitle className='font-semibold'>
            {t('set_password.page_title')}
          </CardTitle>
          <CardDescription className='text-muted-foreground'>
            {t('set_password.page_description')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name='email'
              render={({ field, fieldState }) => {
                return (
                  <Field className='mb-5'>
                    <FieldLabel>{t('set_password.form.email')}</FieldLabel>
                    <Input
                      {...field}
                      placeholder={t('set_password.form.email')}
                      disabled
                      className='rounded-sm cursor-not-allowed disabled:opacity-30'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />

            <Controller
              control={control}
              name='password'
              render={({ field, fieldState }) => {
                const [showPassword, setShowPassword] = useState(false)

                return (
                  <Field className='mb-5'>
                    <FieldLabel>{t('set_password.form.password')}</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder={t('set_password.form.password')}
                        className='rounded-sm'
                        type={showPassword ? 'text' : 'password'}
                      />
                      <InputGroupAddon align='inline-end'>
                        <Button
                          variant='ghost'
                          size='icon'
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />

            <Controller
              control={control}
              name='confirmPassword'
              render={({ field, fieldState }) => {
                const [showPassword, setShowPassword] = useState(false)

                return (
                  <Field className='mb-5'>
                    <FieldLabel>
                      {t('set_password.form.confirm_password')}
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder={t('set_password.form.confirm_password')}
                        className='rounded-sm'
                        type={showPassword ? 'text' : 'password'}
                      />
                      <InputGroupAddon align='inline-end'>
                        <Button
                          variant='ghost'
                          size='icon'
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )
              }}
            />

            <Button className='w-full rounded-sm my-5' disabled={isLoading}>
              {isLoading
                ? t('set_password.form.buttons.loading')
                : t('set_password.form.buttons.submit')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className='flex justify-center text-primary underline'>
          <Link href='/login'>{t('set_password.login')}</Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SetPasswordForm

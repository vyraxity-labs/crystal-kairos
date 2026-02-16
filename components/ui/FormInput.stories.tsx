import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z, ZodType } from 'zod'
import { action } from 'storybook/actions'
import FormInput from './FormInput'
import Button from './Button'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'

const meta = {
  title: 'UI/FormInput',
  component: FormInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'date'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof FormInput>

export default meta
type Story = StoryObj<typeof meta>

/** Standalone text input */
export const StandaloneText: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your name',
  },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className='w-80'>
        <FormInput
          {...(args as Omit<typeof args, 'control' | 'name' | 'rules'>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  },
}

/** Standalone with error state */
export const StandaloneWithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    error: 'Please enter a valid email address',
  },
  render: (args) => (
    <div className='w-80'>
      <FormInput
        {...(args as Omit<typeof args, 'control' | 'name' | 'rules'>)}
        value='invalid'
        onChange={() => {}}
      />
    </div>
  ),
}

/** Standalone password with visibility toggle */
export const StandalonePassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className='w-80'>
        <FormInput
          {...(args as Omit<typeof args, 'control' | 'name' | 'rules'>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  },
}

/** Standalone with adornments */
export const StandaloneWithAdornments: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    type: 'email',
    startAdornment: <EmailIcon />,
  },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className='w-80'>
        <FormInput
          {...(args as Omit<typeof args, 'control' | 'name' | 'rules'>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  },
}

/** Standalone select */
export const StandaloneSelect: Story = {
  args: {
    label: 'Country',
    select: true,
    selectPlaceholder: 'Choose a country',
    options: [
      { value: 'ng', label: 'Nigeria' },
      { value: 'gh', label: 'Ghana' },
      { value: 'ke', label: 'Kenya' },
    ],
  },
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <div className='w-80'>
        <FormInput
          {...(args as Omit<typeof args, 'control' | 'name' | 'rules'>)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    )
  },
}

/** With React Hook Form + Zod validation */

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

function LoginFormExample() {
  const { control, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<LoginForm> = async (formData) => {
    action('formSubmit')(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-80 space-y-4 flex flex-col gap-4'
    >
      <FormInput
        control={control}
        name='email'
        label='Email'
        type='email'
        placeholder='you@example.com'
        startAdornment={<EmailIcon />}
      />
      <FormInput
        control={control}
        name='password'
        label='Password'
        type='password'
        placeholder='••••••••'
        startAdornment={<LockIcon />}
      />

      <Button type='submit' variant='contained'>
        Submit
      </Button>
    </form>
  )
}

export const WithReactHookFormAndZod: Story = {
  render: () => <LoginFormExample />,
}

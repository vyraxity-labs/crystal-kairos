import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import React from 'react'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { action } from 'storybook/actions'
import FormSelect from './FormSelect'
import Button from './Button'

const meta = {
  title: 'UI/FormSelect',
  component: FormSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    errorMessage: { control: 'text' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof FormSelect>

export default meta
type Story = StoryObj<typeof meta>

const stringOptions = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt']

const objectOptions = [
  { value: 'ng', label: 'Nigeria' },
  { value: 'gh', label: 'Ghana' },
  { value: 'ke', label: 'Kenya' },
  { value: 'za', label: 'South Africa' },
  { value: 'eg', label: 'Egypt' },
]

/** Standalone with string options */
export const StandaloneStringOptions: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: stringOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className='w-80'>
        <FormSelect<string>
          label={args.label}
          placeholder={args.placeholder}
          options={stringOptions}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </div>
    )
  },
}

/** Standalone with object options */
export const StandaloneObjectOptions: Story = {
  args: {
    label: 'Country',
    placeholder: 'Choose a country',
    options: objectOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<{ value: string; label: string } | null>(
      null,
    )
    return (
      <div className='w-80'>
        <FormSelect<{ value: string; label: string }>
          label={args.label}
          placeholder={args.placeholder}
          options={objectOptions}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          getOptionLabel={(opt) => opt.label}
        />
      </div>
    )
  },
}

/** Standalone with error state */
export const StandaloneWithError: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: stringOptions,
    error: true,
    errorMessage: 'Please select a valid country',
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className='w-80'>
        <FormSelect<string>
          label={args.label}
          placeholder={args.placeholder}
          error={args.error}
          errorMessage={args.errorMessage}
          options={stringOptions}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </div>
    )
  },
}

/** Standalone loading state */
export const StandaloneLoading: Story = {
  args: {
    label: 'Country',
    placeholder: 'Loading options...',
    options: stringOptions,
    loading: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className='w-80'>
        <FormSelect<string>
          label={args.label}
          placeholder={args.placeholder}
          loading={args.loading}
          options={stringOptions}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
        />
      </div>
    )
  },
}

/** Standalone multiple selection */
export const StandaloneMultiple: Story = {
  args: {
    label: 'Countries',
    placeholder: 'Select countries',
    options: stringOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([])
    return (
      <div className='w-80'>
        <FormSelect<string, true>
          label={args.label}
          placeholder={args.placeholder}
          options={stringOptions}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          props={{ multiple: true }}
        />
      </div>
    )
  },
}

/** Free solo - allows typing custom values not in the list */
export const StandaloneFreeSolo: Story = {
  args: {
    label: 'Country or custom',
    placeholder: 'Select or type a value',
    options: stringOptions,
  },
  render: (args) => {
    const [value, setValue] = useState<string | null>(null)
    return (
      <div className='w-80'>
        <FormSelect<string, false, false, true>
          label={args.label}
          placeholder={args.placeholder}
          options={stringOptions}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          props={{ freeSolo: true }}
        />
      </div>
    )
  },
}

/** Options with flag images */
const countryOptionsWithFlags = [
  { value: 'ng', label: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
  { value: 'gh', label: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
  { value: 'ke', label: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
  {
    value: 'za',
    label: 'South Africa',
    flag: 'https://flagcdn.com/w40/za.png',
  },
  { value: 'eg', label: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
]

export const StandaloneWithFlagImages: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: countryOptionsWithFlags,
  },
  render: (args) => {
    const [value, setValue] = useState<{
      value: string
      label: string
      flag: string
    } | null>(null)
    return (
      <div className='w-80'>
        <FormSelect<{
          value: string
          label: string
          flag: string
        }>
          label={args.label}
          placeholder={args.placeholder}
          options={countryOptionsWithFlags}
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          getOptionLabel={(opt) => opt.label}
          renderOption={(props, option) => {
            return (
              <li {...props}>
                <img
                  src={option.flag}
                  alt=''
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 12,
                    borderRadius: 4,
                    objectFit: 'cover',
                  }}
                />
                <span>{option.label}</span>
              </li>
            )
          }}
        />
      </div>
    )
  },
}

/** Standalone disabled */
export const StandaloneDisabled: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select a country',
    options: stringOptions,
  },
  render: (args) => (
    <div className='w-80'>
      <FormSelect<string>
        label={args.label}
        placeholder={args.placeholder}
        options={stringOptions}
        value='Nigeria'
        onChange={() => {}}
        props={{ disabled: true }}
      />
    </div>
  ),
}

/** With React Hook Form + Zod validation */
const countryOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
})

const profileSchema = z.object({
  country: countryOptionSchema
    .nullable()
    .refine((val) => val !== null && val.value, {
      message: 'Country is required',
    }),
  role: z.string().min(1, 'Please select a role'),
})

type ProfileForm = z.infer<typeof profileSchema>

const roleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
]

function ProfileFormExample() {
  const { control, handleSubmit, formState } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      country: null,
      role: '',
    },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<ProfileForm> = (formData) => {
    action('formSubmit')(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-80 space-y-4 flex flex-col gap-4'
    >
      <Controller
        control={control}
        name='country'
        render={({ field, fieldState }) => (
          <FormSelect<{ value: string; label: string }>
            label='Country'
            placeholder='Choose your country'
            options={objectOptions}
            value={field.value}
            onChange={(_, newValue) => field.onChange(newValue)}
            getOptionLabel={(opt) => opt.label}
            error={!!fieldState.error}
            errorMessage={fieldState.error?.message}
            props={
              { onBlur: field.onBlur } as React.ComponentProps<
                typeof FormSelect<{ value: string; label: string }>
              >['props']
            }
          />
        )}
      />

      <Controller
        control={control}
        name='role'
        render={({ field, fieldState }) => {
          const roleValue = field.value
            ? (roleOptions.find((o) => o.value === field.value) ?? null)
            : null
          return (
            <FormSelect<{ value: string; label: string }>
              label='Role'
              placeholder='Select your role'
              options={roleOptions}
              value={roleValue}
              onChange={(_, newValue) => {
                const opt = newValue as { value: string; label: string } | null
                field.onChange(opt?.value ?? '')
              }}
              getOptionLabel={(opt) =>
                typeof opt === 'string' ? opt : opt.label
              }
              error={!!fieldState.error}
              errorMessage={fieldState.error?.message}
              props={
                { onBlur: field.onBlur } as React.ComponentProps<
                  typeof FormSelect<{ value: string; label: string }>
                >['props']
              }
            />
          )
        }}
      />

      <Button type='submit' variant='contained' disabled={!formState.isValid}>
        Submit
      </Button>
    </form>
  )
}

export const WithReactHookFormAndZod: Story = {
  args: {
    label: 'Country',
    placeholder: 'Select',
    options: objectOptions,
  },
  render: () => <ProfileFormExample />,
}

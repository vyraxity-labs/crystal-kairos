import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { action } from 'storybook/actions'
import { DatePicker } from './DatePicker'
import FormInput from './FormInput'
import Button from './Button'
import dayjs from 'dayjs'

const meta = {
  title: 'UI/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    granularity: {
      control: 'select',
      options: ['day', 'month', 'year'],
    },
    disablePast: { control: 'boolean' },
    disableFuture: { control: 'boolean' },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    helperText: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/** Basic date picker with full date selection */
export const Default: Story = {
  args: {
    label: 'Select Date',
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** With pre-selected date */
export const WithValue: Story = {
  args: {
    label: 'Birth Date',
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(new Date(1990, 5, 15))
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** Month and year only */
export const MonthYear: Story = {
  args: {
    label: 'Select Month & Year',
    granularity: 'month',
    format: 'MMMM YYYY',
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** Year only */
export const YearOnly: Story = {
  args: {
    label: 'Select Year',
    granularity: 'year',
    format: 'YYYY',
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** Disable past dates */
export const DisablePast: Story = {
  args: {
    label: 'Appointment Date',
    disablePast: true,
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** Disable future dates */
export const DisableFuture: Story = {
  args: {
    label: 'Date of Birth',
    disableFuture: true,
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** With min and max date range */
export const WithDateRange: Story = {
  args: {
    label: 'Select Date',
    minDate: dayjs().subtract(30, 'day').toDate(),
    maxDate: dayjs().add(30, 'day').toDate(),
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** Error state */
export const WithError: Story = {
  args: {
    label: 'Select Date',
    error: true,
    helperText: 'Please select a valid date',
  },
  render: (args: Story['args']) => {
    const [value, setValue] = useState<Date | null>(null)
    return (
      <div className='w-80'>
        <DatePicker
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

/** Disabled state */
export const Disabled: Story = {
  args: {
    label: 'Select Date',
  },
  render: (args: Story['args']) => (
    <div className='w-80'>
      <DatePicker
        {...args}
        value={new Date(2024, 0, 15)}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
}

/** With React Hook Form + Zod validation */
const eventFormSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventDate: z
    .date()
    .nullish()
    .refine((val) => val != null, { message: 'Event date is required' }),
  notes: z.string().optional(),
})

type EventForm = z.infer<typeof eventFormSchema>

function EventFormExample() {
  const { control, handleSubmit, formState } = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      eventName: '',
      eventDate: undefined,
      notes: '',
    },
    mode: 'onChange',
  })

  const onSubmit: SubmitHandler<EventForm> = (formData) => {
    action('formSubmit')(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-80 space-y-4 flex flex-col gap-4'
    >
      <FormInput
        control={control}
        name='eventName'
        label='Event Name'
        placeholder='Enter event name'
      />

      <Controller
        control={control}
        name='eventDate'
        render={({ field, fieldState }) => (
          <DatePicker
            label='Event Date'
            value={field.value}
            onChange={field.onChange}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            disablePast
          />
        )}
      />

      <FormInput
        control={control}
        name='notes'
        label='Notes (optional)'
        placeholder='Add any notes'
      />

      <Button type='submit' variant='contained' disabled={!formState.isValid}>
        Submit
      </Button>
    </form>
  )
}

export const WithReactHookFormAndZod: Story = {
  render: () => <EventFormExample />,
}

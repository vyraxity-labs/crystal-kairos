import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['contained', 'outlined', 'text'],
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'inherit',
        'error',
        'info',
        'success',
        'warning',
      ],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Primary Button',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'contained',
    color: 'secondary',
    children: 'Secondary Button',
  },
}

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    children: 'Outlined Button',
  },
}

export const Text: Story = {
  args: {
    variant: 'text',
    color: 'primary',
    children: 'Text Button',
  },
}

export const Disabled: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
}

export const AsLink: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    href: '/register',
    children: 'Register',
  },
}

export const WithStartIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    children: 'Back',
    startIcon: <ArrowBackIcon />,
  },
}

export const Small: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'small',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'large',
    children: 'Large Button',
  },
}

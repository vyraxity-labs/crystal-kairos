import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Logo from './Logo'

const meta = {
  title: 'Common/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    showText: { control: 'boolean' },
    alignment: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Medium: Story = {
  args: {
    size: 'medium',
    showText: true,
    alignment: 'horizontal',
  },
}

export const Large: Story = {
  args: {
    size: 'large',
    showText: true,
    alignment: 'horizontal',
  },
}

export const IconOnly: Story = {
  args: {
    size: 'medium',
    showText: false,
    alignment: 'horizontal',
  },
}

export const Vertical: Story = {
  args: {
    size: 'medium',
    showText: true,
    alignment: 'vertical',
  },
}

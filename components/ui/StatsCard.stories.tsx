import StatsCard from './StatsCard'
import type { Meta, StoryObj } from '@storybook/react'
import Groups2Icon from '@mui/icons-material/Groups2'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'

const meta = {
  title: 'UI/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text' },
    number: { control: 'text' },
    iconColor: { control: 'color' },
    variant: {
      control: 'select',
      options: ['elevation', 'outlined'],
    },
    elevation: { control: { type: 'number', min: 0, max: 24 } },
  },
} satisfies Meta<typeof StatsCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Total members',
    number: '50,700',
    Icon: Groups2Icon,
  },
}

export const WithOtherInfo: Story = {
  args: {
    title: 'Active savings',
    number: '₦2.4M',
    Icon: AccountBalanceWalletIcon,
    otherInfo: (
      <span className='text-sm text-green-600 mt-2'>+12% from last month</span>
    ),
  },
}

export const Outlined: Story = {
  args: {
    title: 'Growth rate',
    number: '24%',
    Icon: TrendingUpIcon,
    variant: 'outlined',
  },
}

export const Elevated: Story = {
  args: {
    title: 'New members',
    number: '1,234',
    Icon: PeopleIcon,
    elevation: 8,
  },
}

export const CustomIconColor: Story = {
  args: {
    title: 'Total members',
    number: '50,700',
    Icon: Groups2Icon,
    iconColor: '#1a4ceb',
  },
}

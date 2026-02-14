import GroupIcon from '@mui/icons-material/Group'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'

export const cardConfig = [
  {
    key: 'eajo',
    icon: GroupIcon,
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
    href: '/eajo',
  },
  {
    key: 'savings',
    icon: TrendingUpIcon,
    iconBg: '#F3E5F5',
    iconColor: '#7B1FA2',
    href: '/savings',
  },
  {
    key: 'loans',
    icon: RequestQuoteIcon,
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    href: '/loans',
  },
] as const

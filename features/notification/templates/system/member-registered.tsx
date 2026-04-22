import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Tailwind,
} from 'react-email'

interface Props {
  memberName: string
  applicationDate: string
  appUrl: string
}

export const MemberRegisteredEmail = ({
  memberName,
  applicationDate,
  appUrl,
}: Props) => (
  <Html>
    <Tailwind>
      <Body className='bg-gray-50 font-sans'>
        <Container className='mx-auto py-10 px-4 max-w-xl'>
          <Heading className='text-2xl font-bold text-navy-800'>
            Application Received 🎉
          </Heading>
          <Text className='text-gray-600'>Hi {memberName},</Text>
          <Text className='text-gray-600'>
            Thank you for applying to join Crystal Kairos. Your application
            submitted on <strong>{applicationDate}</strong> has been received
            and is currently being reviewed.
          </Text>
          <Text className='text-gray-600'>
            Our team will review your application within{' '}
            <strong>7 working days</strong> and notify you of the outcome via
            email.
          </Text>
          <Button
            href={appUrl}
            className='bg-blue-800 text-white px-6 py-3 rounded-md font-medium'
          >
            Visit Portal
          </Button>
          <Hr className='my-6 border-gray-200' />
          <Text className='text-xs text-gray-400'>
            Crystal Kairos Ventures Cooperative Society
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

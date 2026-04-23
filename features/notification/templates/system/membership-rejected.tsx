import { CSSProperties } from 'react'
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email'

interface Props {
  reason: string
  supportUrl: string
  reviewUrl: string
}

const MembershipRejectedEmail = ({
  reason = 'Incomplete documentation: The provided utility bill does not match the provided address in your profile',
  supportUrl = 'https://example.com',
  reviewUrl = 'https://example.com',
}: Props) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Preview>Action Required: Application Rejected</Preview>
        <Body style={main}>
          <Container style={container}>
            <Section>
              <Heading style={heading}>Membership Application Update</Heading>
            </Section>

            <Section>
              <Text className='text-gray-600 text-left'>
                Thank you for your interest in joining Crystal Kairos
                Cooperative. After a careful review of your application, we
                regret to inform you that we are unable to approve your
                membership at this time.
              </Text>
            </Section>

            <Section className='p-4 bg-blue-100 rounded-md'>
              <Row>
                <Column className='w-10 h-10' valign='top'>
                  <div className='w-full aspect-square flex justify-center items-center bg-red-500/15 rounded-sm'>
                    <Img
                      src='https://img.icons8.com/?size=100&id=BxOTqkhzGUup&format=png&color=000000'
                      width={24}
                      height={24}
                      alt='exclamation'
                    />
                  </div>
                </Column>

                <Column valign='top'>
                  <div className='w-full flex flex-col items-start px-4 gap-1'>
                    <Text className='m-0 uppercase text-gray-700 text-xs'>
                      application feedback
                    </Text>
                    <Text className='text-red-600 m-0 font-semibold'>
                      Application Not Approved
                    </Text>
                    <Text className='text-left'>{reason}</Text>
                  </div>
                </Column>
              </Row>
            </Section>

            <Section className='flex bg-white px-4 py-1 rounded-sm mt-4'>
              <Text className='text-left text-xs px-4 py-1 border-l-2'>
                You are welcome to reapply once the requirements are met
              </Text>
            </Section>

            <Section className='flex justify-start mt-4'>
              <Button
                href={reviewUrl}
                className='bg-red-800 text-white px-6 py-3 rounded-md font-medium'
              >
                Review
              </Button>
              <Button
                href={supportUrl}
                className='text-blue-700 px-6 py-3 rounded-md font-medium'
              >
                Contact Support
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default MembershipRejectedEmail

const main: CSSProperties = {
  backgroundColor: '#eef0f4',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
}

const container: CSSProperties = {
  backgroundColor: '#eef0f4',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '0 24px 40px',
  textAlign: 'center',
}

const heading: CSSProperties = {
  color: '#1221ff',
  fontSize: '24px',
}

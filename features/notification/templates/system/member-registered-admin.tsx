import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Html,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email'

interface Props {
  name: string
  email: string
  url: string
}

const MemberRegisteredAdminEmail = ({ name, email, url }: Props) => {
  return (
    <Html>
      <Tailwind>
        <Body className='bg-background font-sans'>
          <Container className='mx-auto py-10 px-4 max-w-xl'>
            <Heading className='text-2xl font-bold text-navy-800'>
              A new member just registered
            </Heading>
            <Text>
              You have a new member registration with the following details:
            </Text>
            <Section>
              <UserItem number={1} label='Name' value={name} />
              <UserItem number={2} label='Email' value={email} />
            </Section>
            <Text>
              To manage members activities - evaluate members, approve or reject
              members - click the link below or visit your admin dashboard
            </Text>
            <Section className='flex justify-center items-center mt-5'>
              <Button
                href={url}
                className='bg-blue-800 text-white px-6 py-3 rounded-md font-medium'
              >
                Manage Activities
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default MemberRegisteredAdminEmail

const UserItem = ({
  label,
  value,
  number,
}: {
  number: number
  label: string
  value: string
}) => (
  <Row className='mb-2'>
    <Column valign='top' width='24' height='24' align='center' className='pr-2'>
      <Row>
        <Column
          align='center'
          valign='middle'
          width='24'
          height='24'
          className='bg-blue-500 rounded-full'
        >
          {number}
        </Column>
      </Row>
    </Column>
    <Column valign='top'>
      <Heading as='h3' className='mt-0 mb-0'>
        {label}
      </Heading>
      <Text className='mt-0 mb-0 text-gray-500 text-lg'>{value}</Text>
    </Column>
  </Row>
)

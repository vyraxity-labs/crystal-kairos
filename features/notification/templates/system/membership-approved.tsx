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
  Text,
} from 'react-email'

interface Props {
  name: string
  email: string
  membershipNumber: string
  tier: string
  setPasswordUrl: string
}

const MembershipApprovedEmail = ({
  name = 'Ayobami',
  email = 'ayobami@gmail.com',
  membershipNumber = 'CRK-7UIOM-901',
  tier = 'Level 1',
  setPasswordUrl = 'https://example.com/set-password',
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to the Crystal Kairos, {name}! Your membership has been
        approved.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Badge Icon */}
          <Section style={iconSection}>
            <div style={iconWrapper}>
              {/* Verified badge icon using inline SVG as img workaround */}
              <Img
                src='https://img.icons8.com/?size=100&id=yXOHowNYbgM5&format=png&color=000000'
                width='32'
                height='32'
                alt='Verified'
                style={badgeIcon}
              />
            </div>
          </Section>

          {/* Heading */}
          <Section style={headingSection}>
            <Heading style={heading}>
              Welcome to the
              <br />
              Cooperative, <span style={nameHighlight}>{name}!</span>
            </Heading>
          </Section>

          {/* Subtext */}
          <Section>
            <Text style={subtext}>
              We are pleased to inform you that your membership application has
              been approved. You are now part of a community dedicated to
              financial growth and stability.
            </Text>
          </Section>

          {/* Member Info Card */}
          <Section style={card}>
            <Row>
              {/* Left side — email + membership ID */}
              <Column style={cardLeft}>
                <Text style={cardLabel}>MEMBER EMAIL</Text>
                <Text style={cardValue}>{email}</Text>

                <Text style={cardLabel}>MEMBERSHIP ID</Text>
                <Text style={cardValueBlue}>{membershipNumber}</Text>
              </Column>

              {/* Right side — trust level */}
              <Column style={cardRight}>
                <div style={trustBadge}>
                  <Img
                    src='https://img.icons8.com/color/48/prize.png'
                    width='24'
                    height='24'
                    alt='Trust Level'
                    style={{ marginBottom: '4px' }}
                  />
                  <Text style={trustLabel}>INITIAL TRUST LEVEL</Text>
                  <Text style={trustValue}>{tier}</Text>
                </div>
              </Column>
            </Row>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button style={button} href={setPasswordUrl}>
              Set Your Password
            </Button>
          </Section>

          {/* Disclaimer */}
          <Section>
            <Text style={disclaimer}>
              If you did not request this, please contact our support team
              immediately to secure your information.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default MembershipApprovedEmail

const main: React.CSSProperties = {
  backgroundColor: '#eef0f4',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '40px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#eef0f4',
  margin: '0 auto',
  maxWidth: '600px',
  padding: '0 24px 40px',
  textAlign: 'center',
}

const iconSection: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '16px',
  paddingTop: '32px',
}

const iconWrapper: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#f1f1f1',
  borderRadius: '50%',
  padding: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}

const badgeIcon: React.CSSProperties = {
  display: 'block',
}

const headingSection: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '8px',
}

const heading: React.CSSProperties = {
  color: '#1e3a5f',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 16px',
  textAlign: 'center',
}

const nameHighlight: React.CSSProperties = {
  color: '#c0440a',
}

const subtext: React.CSSProperties = {
  color: '#555555',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 auto 28px',
  maxWidth: '420px',
  textAlign: 'center',
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px 28px',
  marginBottom: '28px',
  textAlign: 'left',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
}

const cardLeft: React.CSSProperties = {
  verticalAlign: 'top',
  width: '55%',
  paddingRight: '16px',
}

const cardRight: React.CSSProperties = {
  verticalAlign: 'middle',
  width: '45%',
}

const cardLabel: React.CSSProperties = {
  color: '#999999',
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  margin: '0 0 4px',
  textTransform: 'uppercase',
}

const cardValue: React.CSSProperties = {
  color: '#222222',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0 0 16px',
}

const cardValueBlue: React.CSSProperties = {
  color: '#1e3a5f',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
}

const trustBadge: React.CSSProperties = {
  backgroundColor: '#f5f7fa',
  borderRadius: '8px',
  padding: '12px 16px',
  textAlign: 'center',
}

const trustLabel: React.CSSProperties = {
  color: '#999999',
  fontSize: '9px',
  fontWeight: '600',
  letterSpacing: '0.08em',
  margin: '4px 0 2px',
  textTransform: 'uppercase',
}

const trustValue: React.CSSProperties = {
  color: '#222222',
  fontSize: '13px',
  fontWeight: '700',
  margin: '0',
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
}

const button: React.CSSProperties = {
  backgroundColor: '#c0440a',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '600',
  padding: '14px 36px',
  textDecoration: 'none',
  textAlign: 'center',
}

const disclaimer: React.CSSProperties = {
  color: '#999999',
  fontSize: '12px',
  fontStyle: 'italic',
  lineHeight: '1.6',
  margin: '0 auto',
  maxWidth: '380px',
  textAlign: 'center',
}

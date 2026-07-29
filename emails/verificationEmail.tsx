import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Welcome to MentorVerse! Your verification code is {otp}.</Preview>
      <Section style={{ fontFamily: 'Roboto, Arial, sans-serif', lineHeight: '1.6' }}>
        <Row>
          <Heading as="h2" style={{ fontSize: '24px', marginBottom: '20px' }}>
            Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '20px 0',
              color: '#4CAF50',
            }}
          >
            {otp}
          </Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        <Row>
          <Button
            href={`${baseUrl}/verify/${encodeURIComponent(username)}`}
            style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              textDecoration: 'none',
              fontWeight: 'bold',
              marginTop: '20px',
            }}
          >
            Verify Account
          </Button>
        </Row>
      </Section>
    </Html>
  );
}

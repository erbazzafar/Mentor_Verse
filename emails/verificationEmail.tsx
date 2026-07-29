import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
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
      <Preview>Your MentorVerse verification code is {otp}</Preview>
      <Section
        style={{
          fontFamily: 'Roboto, Arial, sans-serif',
          lineHeight: '1.6',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '40px 32px',
          backgroundColor: '#ffffff',
          border: '1px solid #eaeaea',
          borderRadius: '8px',
        }}
      >
        <Row>
          <Heading
            as="h2"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#1a1a1a',
            }}
          >
            Verify your email address
          </Heading>
        </Row>
        <Row>
          <Text style={{ fontSize: '15px', color: '#333333', margin: 0 }}>
            Dear {username},
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: '15px', color: '#333333', marginTop: '8px' }}>
            Thank you for creating an account with MentorVerse. Please enter
            the verification code below to complete your registration.
          </Text>
        </Row>
        <Row>
          <Section
            style={{
              textAlign: 'center',
              margin: '28px 0',
              padding: '20px 0',
              backgroundColor: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
            }}
          >
            <Text
              style={{
                fontSize: '30px',
                fontWeight: 700,
                letterSpacing: '10px',
                color: '#1a1a1a',
                margin: 0,
              }}
            >
              {otp}
            </Text>
          </Section>
        </Row>
        <Row>
          <Text style={{ fontSize: '14px', color: '#555555', margin: 0 }}>
            This code will expire in 10 minutes. For your security, please do
            not share it with anyone.
          </Text>
        </Row>
        <Row>
          <Text style={{ fontSize: '14px', color: '#555555', marginTop: '16px' }}>
            If you did not request this code, no further action is required
            and you may disregard this email.
          </Text>
        </Row>
        <Row>
          <Text
            style={{
              fontSize: '13px',
              color: '#999999',
              marginTop: '32px',
              borderTop: '1px solid #eaeaea',
              paddingTop: '16px',
            }}
          >
            Regards,
            <br />
            The MentorVerse Team
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
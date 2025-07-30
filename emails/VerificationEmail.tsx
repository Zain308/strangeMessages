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
  Img,
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
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Here's your verification code: {otp}</Preview>

      <Section>
        {/* 🔽 Add your image here */}
        <Row>
          <Img
            src="https://your-image-url.com/logo.png"  // Replace with actual image URL
            alt="Verification Banner"
            width="120"
            height="120"
            style={{ margin: '0 auto' }}
          />
        </Row>

        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>

        <Row>
          <Text>
            Thank you for registering. Please use the following verification code to complete your registration:
          </Text>
        </Row>

        <Row>
          <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{otp}</Text>
        </Row>

        <Row>
          <Text style={{ color: '#888', fontSize: '12px' }}>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}

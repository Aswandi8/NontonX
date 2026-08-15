import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  name: string;
  userEmail: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  name,
  userEmail,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Verify your NontonX account</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* HEADER */}

          <Section style={styles.header}>
            <Text style={styles.logo}>NontonX</Text>
          </Section>

          {/* CONTENT */}

          <Section style={styles.content}>
            <Heading style={styles.heading}>Verify your email</Heading>

            <Text style={styles.text}>Hi {name},</Text>

            <Text style={styles.text}>
              Thank you for creating your NontonX account.
            </Text>

            <Text style={styles.text}>
              Please verify the email address below to activate your account:
            </Text>

            <Text style={styles.email}>{userEmail}</Text>

            {/* BUTTON */}

            <Section style={styles.buttonContainer}>
              <Button href={verificationUrl} style={styles.button}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={styles.text}>
              This verification link is required to activate your NontonX
              account.
            </Text>

            <Text style={styles.smallText}>
              If you did not create a NontonX account, you can safely ignore
              this email.
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.smallText}>
              If the button above doesn&apos;t work, copy and paste the
              following link into your browser:
            </Text>

            <Text style={styles.url}>{verificationUrl}</Text>
          </Section>

          {/* FOOTER */}

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} NontonX. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* =========================================
   STYLES
========================================= */

const styles = {
  body: {
    backgroundColor: "#0A0A0A",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "40px 20px",
  },

  container: {
    backgroundColor: "#141414",
    border: "1px solid #292929",
    borderRadius: "12px",
    margin: "0 auto",
    maxWidth: "520px",
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#0A0A0A",
    borderBottom: "1px solid #292929",
    padding: "24px",
    textAlign: "center" as const,
  },

  logo: {
    color: "#D4A017",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    margin: 0,
  },

  content: {
    padding: "36px 32px",
  },

  heading: {
    color: "#FFFFFF",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0 0 24px",
    textAlign: "center" as const,
  },

  text: {
    color: "#A3A3A3",
    fontSize: "15px",
    lineHeight: "1.7",
    margin: "0 0 16px",
  },

  email: {
    color: "#D4A017",
    fontSize: "15px",
    fontWeight: "600",
    lineHeight: "1.6",
    margin: "0 0 20px",
  },

  buttonContainer: {
    padding: "12px 0 24px",
    textAlign: "center" as const,
  },

  button: {
    backgroundColor: "#D4A017",
    borderRadius: "8px",
    color: "#0A0A0A",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "600",
    padding: "13px 24px",
    textDecoration: "none",
  },

  smallText: {
    color: "#737373",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "16px 0",
  },

  hr: {
    borderColor: "#292929",
    margin: "28px 0",
  },

  url: {
    color: "#D4A017",
    fontSize: "12px",
    lineHeight: "1.6",
    overflowWrap: "break-word" as const,
    wordBreak: "break-word" as const,
  },

  footer: {
    backgroundColor: "#0A0A0A",
    borderTop: "1px solid #292929",
    padding: "20px",
    textAlign: "center" as const,
  },

  footerText: {
    color: "#737373",
    fontSize: "12px",
    margin: 0,
  },
};

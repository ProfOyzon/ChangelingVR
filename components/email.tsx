import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

type GeoLocationData = {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  query: string;
};

const EmailLayout = ({ preview, children }: { preview: string; children: React.ReactNode }) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-indigo-100 p-6 font-sans">
          <Container className="mx-auto w-full max-w-xl rounded-md border-2 border-gray-200 bg-sky-50 p-6 shadow-md">
            <Section className="mb-4 flex justify-center">
              <Img
                src="https://changelingvr.vercel.app/high-res-logo.png"
                alt="Changeling VR Logo"
                className="h-12 w-12"
              />
            </Section>

            {children}

            <Hr className="my-6 border-gray-200" />

            <Text className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Changeling VR. All rights reserved. <br /> This email
              and any attachments are confidential and intended solely for the use of the intended
              recipient. If you have received this email in error, please delete it from your
              system. <br /> Changeling VR | Rochester, NY, USA
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export const WelcomeEmail = ({ name }: { name: string }) => {
  return (
    <EmailLayout preview="Welcome to Changeling VR">
      <Text className="text-base text-black">
        Hello <strong>{name}</strong>,
      </Text>
      <Text className="text-base text-black">
        Welcome to Changeling VR! We&apos;re excited to have you on board.
      </Text>
      <Text className="text-base text-black">
        To get started, visit your{' '}
        <Link href="https://changelingvr.vercel.app/dashboard/settings">settings</Link> to update
        your username and configure your profile.
      </Text>
      <Text className="text-base text-black">
        Need help? Check out our{' '}
        <Link href="https://changelingvr.vercel.app/auth/help">Help Center</Link> or join our{' '}
        <Link href="https://discord.gg/btEUjqazvP">Discord community</Link>.
      </Text>
      <Text className="text-base text-black">
        If you have any questions, reply to this email or contact us at{' '}
        <Link href="mailto:support@changelingvr.com">support@changelingvr.com</Link>.
      </Text>
      <Text className="text-base text-black">
        We&apos;re glad to have you join our family of talented changelings!
      </Text>
    </EmailLayout>
  );
};

export const LoginEmail = ({ name, data }: { name: string; data: GeoLocationData }) => {
  return (
    <EmailLayout
      preview={`A new login was detected from ${data.city}, ${data.regionName}, ${data.country}`}
    >
      <Text className="text-base text-black">
        Hello <strong>{name}</strong>,
      </Text>

      <Text className="text-base text-black">
        Your Changeling VR account was recently signed-in from a new location, device, or browser.
      </Text>

      <Section>
        <Row>
          <Column className="font-semibold">Location</Column>
          <Column>
            {data.city}, {data.regionName}, {data.country}
          </Column>
        </Row>
        <Row>
          <Column className="font-semibold">Time</Column>
          <Column>{new Date().toLocaleString()}</Column>
        </Row>
        <Row>
          <Column className="font-semibold">IP</Column>
          <Column>{data.query}</Column>
        </Row>
      </Section>

      <Text className="text-base text-black">Don&apos;t recognize this activity?</Text>

      <Text className="text-base text-black">
        Review your{' '}
        <Link href="https://changelingvr.vercel.app/dashboard/settings">recent activity</Link> and{' '}
        <Link href="https://changelingvr.vercel.app/dashboard/settings">settings</Link> now.
      </Text>

      <Text className="text-base text-black">
        We are sending this email because we were unable to determine if you have signed-in from
        this location or browser before. This may be because you are traveling, using a VPN, a new
        or updated browser, or another person is using your account.
      </Text>
    </EmailLayout>
  );
};

export const PasswordResetEmail = ({ username, url }: { username: string; url: string }) => {
  return (
    <EmailLayout preview="Reset your Changeling VR password">
      <Text className="text-base text-black">
        Hello <strong>{username}</strong>,
      </Text>

      <Text className="text-base text-black">
        We received a request to reset your Changeling VR password. To set a new password, please
        click the button below:
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={url}
          className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white no-underline transition hover:bg-indigo-700"
        >
          Reset Password
        </Button>
      </Section>

      <Text className="text-base text-black">
        If the button above does not work, please copy and paste the following link into your
        browser:
      </Text>

      <Link href={url} className="my-2 text-xs break-all">
        {url}
      </Link>
    </EmailLayout>
  );
};

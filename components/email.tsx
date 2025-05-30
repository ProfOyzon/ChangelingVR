import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

const EmailLayout = ({ preview, children }: { preview: string; children: React.ReactNode }) => {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="font-sans bg-indigo-100 mx-auto my-auto p-6">
          <Container className="max-w-xl mx-auto p-6 w-full bg-sky-50 rounded-lg shadow-md border-2 border-gray-200">
            <Section className="flex justify-center mb-4">
              <Img
                src="https://changelingvr.vercel.app/logo.svg"
                alt="Changeling VR Logo"
                className="h-12 w-auto"
              />
            </Section>

            {children}

            <Hr className="my-6 border-gray-200" />

            <Text className="text-gray-400 text-xs mt-6 text-center">
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
      <Text className="text-black text-base">
        Hello <strong>{name}</strong>,
      </Text>
      <Text className="text-black text-base">
        Welcome to Changeling VR! We&apos;re excited to have you on board.
      </Text>
      <Text className="text-black text-base">
        To get started, visit your{' '}
        <Link href="https://changelingvr.vercel.app/dashboard/settings">settings</Link> to update
        your username and configure your profile.
      </Text>
      <Text className="text-black text-base">
        Need help? Check out our{' '}
        <Link href="https://changelingvr.vercel.app/auth/help">Help Center</Link> or join our{' '}
        <Link href="https://discord.gg/btEUjqazvP">Discord community</Link>.
      </Text>
      <Text className="text-black text-base">
        If you have any questions, reply to this email or contact us at{' '}
        <Link href="mailto:support@changelingvr.com">support@changelingvr.com</Link>.
      </Text>
      <Text className="text-black text-base">
        We&apos;re glad to have you join our family of talented changelings!
      </Text>
    </EmailLayout>
  );
};

export const PasswordResetEmail = ({ username, url }: { username: string; url: string }) => {
  return (
    <EmailLayout preview="Reset your Changeling VR password">
      <Text className="text-black text-base">
        Hello <strong>{username}</strong>,
      </Text>

      <Text className="text-black text-base">
        We received a request to reset your Changeling VR password. To set a new password, please
        click the button below:
      </Text>

      <Section className="text-center my-6">
        <Button
          href={url}
          className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold text-base no-underline hover:bg-indigo-700 transition"
        >
          Reset Password
        </Button>
      </Section>

      <Text className="text-black text-base">
        If the button above does not work, please copy and paste the following link into your
        browser:
      </Text>

      <Link href={url} className="text-xs break-all my-2">
        {url}
      </Link>
    </EmailLayout>
  );
};

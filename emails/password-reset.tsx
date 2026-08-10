import { Button, Link, Section, Text } from 'react-email';
import EmailLayout from './layout';

export default function PasswordResetEmail({ username, url }: { username: string; url: string }) {
  return (
    <EmailLayout preview="Reset your ChangelingVR password">
      <Text className="text-base text-black">
        Hello <strong>{username}</strong>,
      </Text>

      <Text className="text-base text-black">
        We received a request to reset your ChangelingVR password. To set a new password, please
        click the button below:
      </Text>

      <Section className="my-6 text-center">
        <Button
          href={url}
          className="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white no-underline"
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
}

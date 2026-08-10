import { Link, Text } from 'react-email';
import EmailLayout from './layout';

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <EmailLayout preview="Welcome to ChangelingVR">
      <Text className="text-base text-black">
        Hello <strong>{name}</strong>,
      </Text>
      <Text className="text-base text-black">
        Welcome to ChangelingVR! We&apos;re excited to have you on board.
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
}

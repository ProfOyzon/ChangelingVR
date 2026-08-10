import { Column, Link, Row, Section, Text } from 'react-email';
import EmailLayout from './layout';

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

export default function UnknownLoginEmail({ name, data }: { name: string; data: GeoLocationData }) {
  return (
    <EmailLayout
      preview={`A new login was detected from ${data.city}, ${data.regionName}, ${data.country}`}
    >
      <Text className="text-base text-black">
        Hello <strong>{name}</strong>,
      </Text>

      <Text className="text-base text-black">
        Your ChangelingVR account was recently signed-in from a new location, device, or browser.
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
}

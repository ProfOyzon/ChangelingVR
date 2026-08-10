import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'react-email';

export default function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-indigo-100 p-4 font-sans">
          <Container className="mx-auto w-full max-w-xl rounded-md border-2 border-gray-200 bg-sky-50 p-4">
            <Section className="mb-4 flex justify-center">
              <Img
                src="https://changelingvr.vercel.app/high-res-logo.png"
                alt="ChangelingVR Logo"
                className="size-12"
              />
            </Section>

            {children}

            <Hr className="my-6 border-gray-200" />

            <Text className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} ChangelingVR. All rights reserved. <br /> This email and
              any attachments are confidential and intended solely for the use of the intended
              recipient. If you have received this email in error, please delete it from your
              system. <br /> ChangelingVR | Rochester, NY, USA
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

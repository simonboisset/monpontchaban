import { Container, Head, Heading, Html, Link, Tailwind, Text } from '@react-email/components';

export function SignupEmail({ onboardingUrl, otp }: { onboardingUrl: string; otp: string }) {
  return (
    <Tailwind config={{ theme: { extend: { colors: { brand: '#007291' } } } }}>
      <Html lang={'fr'} dir='ltr'>
        <Head title='Inscription' />
        <Container>
          <Heading as='h1'>Bienvenu</Heading>
          <Text>
            Votre code d'activation est:
            <strong>{otp}</strong>
          </Text>
          <Text>Si vous avez un problème ou des questions, contactnous par mail à :</Text>
          <Link href='mailto:support@lezo.dev'>support@lezo.led</Link>
        </Container>
      </Html>
    </Tailwind>
  );
}

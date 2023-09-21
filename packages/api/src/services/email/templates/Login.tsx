import { Container, Head, Heading, Html, Preview, Tailwind, Text } from '@react-email/components';

export function LoginEmail({ onboardingUrl, otp }: { onboardingUrl: string; otp: string }) {
  return (
    <Tailwind config={{ theme: { extend: { colors: { brand: '#007291' } } } }}>
      <Html lang='fr' dir='ltr'>
        <Head title='Connexion' />
        <Preview>Connexion</Preview>
        <Container>
          <Heading as='h1'>Connexion à Mon Pont Chaban</Heading>
          <Text>
            Votre code de cnnexion est:
            <strong>{otp}</strong>
          </Text>
        </Container>
      </Html>
    </Tailwind>
  );
}

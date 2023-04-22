import {Body, Container, Head, Heading, Hr, Html, Link, Preview, Tailwind, Text} from '@react-email/components';
import React from 'react';
import {env} from '../../../config/env';

type ValidationCodeProps = {
  email: string;
  code: string;
};
export const ValidationCode = ({code, email}: ValidationCodeProps) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#007291',
            },
          },
        },
      }}>
      <Html>
        <Head />
        <Preview>Votre code de connexion</Preview>
        <Body>
          <Container>
            <Heading>Code de connexion</Heading>
            <Text>
              Votre code de connexion est le suivant: <code>{code}</code>
            </Text>
            <Hr />
            <Text>Vous pouvez également cliquer sur le lien ci-dessous pour vous connecter.</Text>
            <Link
              className="bg-brand text-white p-2 rounded"
              href={
                env.NODE_ENV === 'production'
                  ? `https://pont-chaban-delmas.com/auth/${encodeURIComponent(email)}/${code}`
                  : `http://localhost:3000/auth/${encodeURIComponent(email)}/${code}`
              }>
              Se connecter
            </Link>

            <Text>Si vous n'avez pas demandé de code de connexion, vous pouvez ignorer cet email.</Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

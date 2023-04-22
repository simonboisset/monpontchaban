import {Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text} from '@react-email/components';
import React from 'react';

type DeletionCodeProps = {
  code?: string;
};
export const DeletionCode = ({code}: DeletionCodeProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirmer la suppression de votre compte</Preview>
      <Body>
        <Container>
          <Heading>Confirmer la suppression de votre compte</Heading>
          <Section>
            <Button href="https://linear.app">Connexion</Button>
          </Section>
          <Text>
            This link and code will only be valid for the next 5 minutes. If the link does not work, you can use the
            login verification code directly:
          </Text>
          <code>{code}</code>
          <Hr />
          <Link href="https://linear.app">Linear</Link>
        </Container>
      </Body>
    </Html>
  );
};

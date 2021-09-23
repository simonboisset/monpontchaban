import { fr } from 'const';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 72px;
`;
const Text = styled.Text`
  font-family: ${({ theme }) => theme.typography.h2.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
  color: ${({ theme }) => theme.colors.white.main};
`;

export const Header: React.FC = () => {
  return (
    <Container>
      <SafeAreaView edges={['top']}>
        <Text>{fr.MyChaban}</Text>
      </SafeAreaView>
    </Container>
  );
};

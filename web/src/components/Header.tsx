import { fr } from 'const';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  margin-left: 10%;
  padding-left: 5%;
  padding-right: 5%;
  align-items: center;
  box-shadow: ${({ theme }) => theme.shadow(3)};
  border-radius: 0px 0px 36px 36px;
  height: 72px;
  background-color: ${({ theme }) => theme.colors.background.main};
  font-family: ${({ theme }) => theme.typography.h1.font};
  font-size: ${({ theme }) => theme.typography.h2.size}px;
`;

export const Header: React.FC = () => {
  return <Container>{fr.MyChaban}</Container>;
};

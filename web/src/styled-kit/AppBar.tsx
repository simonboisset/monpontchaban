import styled from 'styled-components';

type AppBarProps = {
  elevation?: number;
};

export const AppBar = styled.header<AppBarProps>`
  display: flex;
  flex-direction: row;
  width: 100%;
  column-gap: ${({ theme }) => theme.space(2)}px;
  ${({ elevation, theme }) => elevation && `box-shadow: ${theme.shadow(elevation)};`}
`;

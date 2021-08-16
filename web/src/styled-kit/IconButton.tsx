import React from 'react';
import styled from 'styled-components';
import { Theme } from 'styles';
import { RippleContainer, Ripples, useRipples } from './Ripples';

type IconButtonContainerProps = {
  margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
  elevation?: number;
};
const IconButtonContainer = styled(RippleContainer)<IconButtonContainerProps>`
  ${({ elevation, theme }) => elevation && `box-shadow: ${theme.shadow(elevation)};`}
  border-radius:100%;
  transition: all 0.3s ease-out;
  ${({ margin = 3, theme }) =>
    typeof margin === 'object'
      ? `margin: ${theme.space(margin.top || 0)}px ${theme.space(margin.right || 0)}px ${theme.space(
          margin.bottom || 0
        )}px ${theme.space(margin.left || 0)}px;`
      : `margin: ${theme.space(margin)}px;`}
  &:hover {
    ${({ elevation, theme }) => elevation && `box-shadow: ${theme.shadow(elevation + 2)};`}
  }
  &:active {
    ${({ elevation, theme }) => elevation && `box-shadow: ${theme.shadow(elevation - 2)};`}
  }
`;

type IconButtonBaseProps = {
  color?: keyof Theme['colors'];
  variant?: 'contained' | 'outlined' | 'text';
};
const IconButtonBase = styled.button<IconButtonBaseProps>`
  display: flex;
  border: none;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space(2)}px;
  border-radius: 100%;
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 18px;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  background-color: ${({ color = 'primary', theme, variant }) =>
    variant === 'contained' ? theme.colors[color].main : theme.colors.background.main};
  transition: all 0.3s ease-out;
  &:hover {
    background-color: ${({ color = 'primary', theme, variant }) =>
      variant === 'contained' ? theme.colors[color].dark : theme.colors.background.dark};
  }
  &:active {
    background-color: ${({ color = 'primary', theme, variant }) =>
      variant === 'contained' ? theme.colors[color].light : theme.colors.background.light};
  }
`;
type IconButtonProps = IconButtonContainerProps & IconButtonBaseProps;
export const IconButton: React.FC<IconButtonProps> = ({ children, elevation, margin, ...other }) => {
  const { ripples, onMouseDown } = useRipples();
  return (
    <IconButtonContainer margin={margin} elevation={elevation} onMouseDown={onMouseDown}>
      <IconButtonBase {...other}>{children}</IconButtonBase>
      <Ripples ripples={ripples} dark duration={8} />
    </IconButtonContainer>
  );
};

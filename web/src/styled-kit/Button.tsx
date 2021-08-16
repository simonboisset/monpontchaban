import React, { FC } from 'react';
import styled from 'styled-components';
import { Theme } from 'styles';
import { Icon } from './Icon';
import { RippleContainer, Ripples, useRipples } from './Ripples';
import { TextTransform } from './Typography';

type ButtonContainerProps = {
  margin?: number | { top?: number; bottom?: number; left?: number; right?: number };
  elevation?: number;
  radius?: boolean;
};

const ButtonContainer = styled(RippleContainer)<ButtonContainerProps>`
  ${({ elevation, theme }) => elevation && `box-shadow: ${theme.shadow(elevation)};`}
  border-radius:${({ radius = true, theme }) => (radius ? theme.radius : 0)}px;
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
type ButtonBaseProps = {
  color?: keyof Theme['colors'];
  padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
  transform?: TextTransform;
  typography?: keyof Theme['typography'];
  variant?: 'contained' | 'outlined' | 'text';
  fullWidth?: boolean;
};
const ButtonBase = styled.button<ButtonBaseProps>`
  display: flex;
  ${({ fullWidth }) => fullWidth && `width: 100%;`}
  border: none;
  flex-wrap: nowrap;
  column-gap: ${({ theme }) => theme.space(3)}px;
  flex-direction: row;
  ${({ padding = 3, theme }) =>
    typeof padding === 'object'
      ? `padding: ${theme.space(padding.top || 0)}px ${theme.space(padding.right || 0)}px ${theme.space(
          padding.bottom || 0
        )}px ${theme.space(padding.left || 0)}px;`
      : `padding: ${theme.space(padding)}px;`}
  background-color: ${({ color = 'primary', theme, variant }) =>
    variant === 'contained' ? theme.colors[color].main : theme.colors.background.main};
  font-family: ${({ typography = 'h5', theme }) => theme.typography[typography].font};
  align-items: center;
  text-align: center;
  justify-content: space-between;
  font-style: ${({ typography = 'h5', theme }) => theme.typography[typography].style};
  font-weight: ${({ typography = 'h5', theme }) => theme.typography[typography].weight};
  ${({ transform }) => transform && `text-transform: ${transform};`}
  color:${({ color = 'primary', theme, variant }) =>
    variant === 'contained' ? theme.colors.background.main : theme.colors[color].main};
  font-size: ${({ typography = 'h5', theme }) => theme.typography[typography].size}px;
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

type ButtonProps = ButtonContainerProps &
  ButtonBaseProps & {
    iconLeft?: string;
    iconRight?: string;
  };
type RevertPaddingProps = {
  padding?: number;
};
const RevertPadding = styled.div<RevertPaddingProps>`
  margin-left: -${({ theme, padding }) => theme.space(padding)}px;
`;
export const Button: FC<ButtonProps> = ({
  children,
  iconLeft,
  iconRight,
  margin,
  padding = 3,
  elevation,
  ...other
}) => {
  const { ripples, onMouseDown } = useRipples();
  return (
    <ButtonContainer margin={margin} elevation={elevation} onMouseDown={onMouseDown}>
      <ButtonBase {...other} padding={padding}>
        {iconLeft ? (
          <Icon>{iconLeft}</Icon>
        ) : (
          <RevertPadding padding={typeof padding === 'object' ? padding.left : padding} />
        )}
        {children}
        {iconRight ? (
          <Icon>{iconRight}</Icon>
        ) : (
          <RevertPadding padding={typeof padding === 'object' ? padding.right : padding} />
        )}
      </ButtonBase>
      <Ripples ripples={ripples} dark duration={5} />
    </ButtonContainer>
  );
};

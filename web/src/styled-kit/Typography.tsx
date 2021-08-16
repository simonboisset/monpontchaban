import styled from 'styled-components';
import { Theme } from 'styles';

type TextAlign = 'center' | 'justify' | 'start' | 'start' | 'end' | 'left' | 'right';
export type TextTransform = 'capitalize' | 'lowercase' | 'uppercase' | 'uppercase' | 'initial' | 'unset' | 'none';
export type TypographyProps = {
  color?: keyof Theme['colors'];
  variant?: keyof Theme['typography'];
  transform?: TextTransform;
  opacity?: number;
  margin?: number;
  padding?: number;
  align?: TextAlign;
};

export const Typography = styled.div<TypographyProps>`
  ${({ color, theme }) => color && `color: ${theme.colors[color]};`}
  ${({ variant, theme }) => variant && `font-family: ${theme.typography[variant].font};`}
  ${({ variant, theme }) => variant && `font-size: ${theme.typography[variant].size};`}
  ${(props) => props.transform && `text-transform: ${props.transform};`}
  ${(props) => props.opacity && `opacity: ${props.opacity};`}
  ${({ margin, theme }) => margin && `margin: ${theme.space(margin)}px;`}
  ${({ padding, theme }) => padding && `padding: ${theme.space(padding)}px;`}
  ${(props) => props.align && `text-align: ${props.align};`}
`;

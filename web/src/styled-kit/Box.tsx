import styled from 'styled-components';
import { Theme } from 'styles';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse' | 'inherit';
export type JustifyContent =
  | 'center'
  | 'flex-end'
  | 'flex-start'
  | 'stretch'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type AligneItems = 'center' | 'flex-end' | 'flex-start' | 'stretch';

type BoxProps = {
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  wrap?: boolean;
  align?: 'stretch' | 'flex-start' | 'flex-end' | 'center';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';
  spacing?: number;
  grow?: number;
  color?: keyof Theme['colors'];
  margin?: number;
  padding?: number;
  elevation?: number;
  radius?: boolean;
};

export const Box = styled.div<BoxProps>`
  display: flex;
  ${({ margin, theme }) => margin && `margin: ${theme.space(margin)}px;`}
  ${({ padding, theme }) => padding && `padding: ${theme.space(padding)}px;`}
  ${({ elevation, theme }) => elevation && `box-shadow: ${theme.shadow(elevation)};`}
  ${({ wrap }) => wrap && `flex-wrap: ${wrap};`}
  ${({ direction }) => direction && `flex-direction: ${direction};`}
  ${({ align }) => align && `align-items: ${align};`}
  ${({ justify }) => justify && `justify-content: ${justify};`}
  ${({ spacing, theme }) => spacing && `row-gap: ${theme.space(spacing)}px;`}
  ${({ spacing, theme }) => spacing && `column-gap: ${theme.space(spacing)}px;`}
  ${({ grow }) => grow && `flex-grow: ${grow};`}
  ${({ color, theme }) => color && `background-color: ${theme.colors[color].main};`}
  ${({ radius, theme }) => radius && `border-radius: ${theme.radius}px;`}
`;

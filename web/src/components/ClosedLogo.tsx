import { theme, Theme } from 'const';
import styled from 'styled-components';
type LogoProps = {
  width?: number;
  color?: keyof Theme['colors'];
  bottom?: number;
  right?: number;
};
const Container = styled.div<LogoProps>`
  width: ${({ width = 350 }) => width}px;
  margin-right: ${({ right = 0 }) => right}px;
  margin-bottom: ${({ bottom = 0 }) => bottom}px;
`;
export const ClosedLogo: React.FC<LogoProps> = ({ width, color = 'white', bottom, right }) => {
  return (
    <Container width={width} bottom={bottom} right={right}>
      <svg viewBox="280.0 180.0 300.0 210.0" fill={theme.colors[color].main}>
        <g>
          <path d="m334.4777 214.06299l28.818909 0l0 179.08661l-28.818909 0z" />
          <path d="m334.4777 214.66299l0 -21.606293l28.818909 21.606293z" />
          <path d="m286.66928 200.68242l28.818909 0l0 179.08662l-28.818909 0z" />
          <path d="m286.66928 201.18242l0 -21.606308l28.818909 21.606308z" />
          <path d="m575.3036 209.95013l-28.818909 0l0 179.08661l28.818909 0z" />
          <path d="m575.3036 210.55013l0 -21.606308l-28.818909 21.606308z" />
          <path d="m524.31506 200.68242l-28.818909 0l0 179.08662l28.818909 0z" />
          <path d="m524.31506 201.28242l0 -21.606308l-28.818909 21.606308z" />
          <path d="m286.66928 282.67715l0 0c0 -18.047089 64.61203 -32.677155 144.31497 -32.677155c79.70294 0 144.31494 14.630066 144.31494 32.677155l-16.338562 0c0 -9.023529 -57.296967 -16.338562 -127.97638 -16.338562c-70.67941 0 -127.97638 7.315033 -127.97638 16.338562z" />
        </g>
      </svg>
    </Container>
  );
};

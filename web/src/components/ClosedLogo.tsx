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
      <svg viewBox="0 0 461 396">
        <path
          d="M0 0L44 44V134.914C51.0593 130.423 58.9106 126.167 67.5119 122.193C71.8567 120.186 76.3571 118.267 81 116.438V88V44L125 88V102.81C157.334 95.1197 193.458 91 230.5 91C267.542 91 303.666 95.1197 336 102.81V44L380 0V44V116.438C384.643 118.267 389.143 120.186 393.488 122.193C402.089 126.167 409.941 130.423 417 134.914V88L461 44V88V197.5V396H417V184.142C412.135 169.64 399.415 155.922 380 144.28V352H336V125.197C305.054 115.558 268.364 110.301 230.5 110.301C192.636 110.301 155.946 115.558 125 125.197V396H81V144.28C61.5851 155.922 48.8652 169.64 44 184.142V352H0V197.5V44V0Z"
          fill={theme.colors[color].main}
        />
      </svg>
    </Container>
  );
};

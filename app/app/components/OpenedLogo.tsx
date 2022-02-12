import { theme, Theme } from '~/const/theme';

type LogoProps = {
  color?: keyof Theme['colors'];
};

export const OpenedLogo: React.FC<LogoProps> = ({ color = 'white' }) => {
  return (
    <svg viewBox='0 0 461 396'>
      <path
        d='M0 0L44 44V260.914C51.0593 256.423 58.9106 252.167 67.5119 248.193C71.8567 246.186 76.3571 244.267 81 242.438V88V44L125 88V228.81C157.334 221.12 193.458 217 230.5 217C267.542 217 303.666 221.12 336 228.81V44L380 0V44V242.438C384.643 244.267 389.143 246.186 393.488 248.193C402.089 252.167 409.941 256.423 417 260.914V88L461 44V88V323.5V396H417V310.142C412.135 295.64 399.415 281.922 380 270.28V352H336V251.197C305.054 241.558 268.364 236.301 230.5 236.301C192.636 236.301 155.946 241.558 125 251.197V396H81V270.28C61.5851 281.922 48.8652 295.64 44 310.142V352H0V323.5V44V0Z'
        fill={theme.colors[color].main}
      />
    </svg>
  );
};

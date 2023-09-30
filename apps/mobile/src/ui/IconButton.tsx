import { LucideIcon } from 'lucide-react-native';
import { Circle, Spinner, StackProps, useTheme } from 'tamagui';
import { RootNavigationProps, useRootNavigation } from '../services/useRootNavigation';
import { type Theme } from './Theme';

export type IconButtonProps = {
  color?: Theme.Color;
  Icon: LucideIcon;
  loading?: boolean;
  href?: RootNavigationProps;
  onPress?: () => void;
} & StackProps;
export const IconButton = ({ color = 'primary', Icon, href, loading, onPress, ...props }: IconButtonProps) => {
  const { navigate } = useRootNavigation();
  const theme = useTheme();
  return (
    <Circle
      onPress={href ? () => navigate(...href) : onPress}
      bg='$foregroundTransparent'
      size='$4'
      animation='bouncy'
      animateOnly={['opacity']}
      pressStyle={{
        opacity: 0.3,
      }}
      {...props}>
      {Icon && !loading && <Icon color={theme[color].val} />}
      {loading && <Spinner size='small' color={theme[color].val} />}
    </Circle>
  );
};

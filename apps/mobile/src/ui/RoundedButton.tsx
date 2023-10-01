import { Circle, StackProps, Text } from 'tamagui';
import { RootNavigationProps, useRootNavigation } from '../services/useRootNavigation';
import { type Theme } from './Theme';

export type RoundedButtonProps = {
  color?: Theme.Color;
  label: string;
  active?: boolean;
  href?: RootNavigationProps;
  onPress?: () => void;
} & StackProps;
export const RoundedButton = ({ color = 'primary', label, href, onPress, active, ...props }: RoundedButtonProps) => {
  const { navigate } = useRootNavigation();

  return (
    <Circle
      onPress={href ? () => navigate(...href) : onPress}
      bg={active ? '$primary' : '$foregroundTransparent'}
      size='$4'
      animation='bouncy'
      animateOnly={['opacity']}
      pressStyle={{
        opacity: 0.3,
      }}
      {...props}>
      {label && (
        <Text fontSize={16} color={active ? '$primaryForeground' : '$primary'}>
          {label}
        </Text>
      )}
    </Circle>
  );
};

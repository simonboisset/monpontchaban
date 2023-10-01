import { LucideIcon } from 'lucide-react-native';
import { forwardRef } from 'react';
import { ButtonFrame, Spinner, StackProps, Text, View, useTheme } from 'tamagui';
import { RootNavigationProps, useRootNavigation } from '../services/useRootNavigation';
import { type Theme } from './Theme';

export type ButtonProps = {
  variant?: Theme.Variant;
  color?: Theme.Color;
  desabled?: boolean;
  label?: string;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  loading?: boolean;
  href?: RootNavigationProps;
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  textAling?: 'left' | 'center' | 'right';
} & StackProps;

export const Button = forwardRef(
  (
    {
      label,
      color = 'primary',
      textAling = 'center',
      LeftIcon,
      RightIcon,
      onPressIn,
      onPressOut,
      desabled,
      href,
      loading,
      size = 'medium',
      onPress,
      variant = 'contained',
      ...rest
    }: ButtonProps,
    ref,
  ) => {
    const { navigate } = useRootNavigation();
    const theme = useTheme();
    const textColor = theme[color].val;
    return (
      <ButtonFrame
        ref={ref as any}
        p={0}
        px={size === 'medium' ? '$4' : '$6'}
        animation={'slow'}
        animateOnly={['opacity', 'scale']}
        position='relative'
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        bg='$foregroundTransparent'
        borderRadius={14}
        pressStyle={{
          scale: 0.98,
          opacity: 0.6,
        }}
        onPress={loading ? () => {} : href ? () => navigate(...href) : onPress}
        {...rest}>
        {LeftIcon && (
          <View position='absolute' left={size === 'medium' ? '$4' : '$6'}>
            <LeftIcon color={textColor} size={size === 'medium' ? 20 : 32} />
          </View>
        )}
        {label && (
          <Text flex={1} textAlign={textAling} color={textColor} fontSize={size === 'medium' ? 16 : 32}>
            {label}
          </Text>
        )}
        {RightIcon && !loading && (
          <View position='absolute' right={size === 'medium' ? '$4' : '$6'}>
            <RightIcon color={textColor} size={size === 'medium' ? 20 : 32} />
          </View>
        )}
        {loading && (
          <View position='absolute' right={size === 'medium' ? '$4' : '$8'}>
            <Spinner size='small' color={textColor} />
          </View>
        )}
      </ButtonFrame>
    );
  },
);

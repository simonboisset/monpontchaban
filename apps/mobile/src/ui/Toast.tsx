import React from 'react';
import { H4, Text, View } from 'tamagui';
import { Theme } from './Theme';
import { useToast } from './useToast';

type ToastProps = {
  title: string;
  message?: string;
  open: boolean;
  color?: Theme.Color;
  offsetTop?: number;
};

export const Toast = ({ title, message, color = 'error', open, offsetTop = 0 }: ToastProps) => {
  return (
    <View
      top={-200}
      position='absolute'
      backgroundColor={`$${color}`}
      borderColor={`$${color}`}
      borderWidth={1}
      paddingVertical={12}
      borderRadius={12}
      width='90%'
      alignSelf='center'
      paddingHorizontal={16}
      zIndex={1000}
      transform={[{ translateY: open ? offsetTop + 280 : offsetTop }]}
      animateOnly={['transform']}
      animation='bouncy'>
      <H4 color={`$${color}Foreground`}>{title}</H4>
      {message && <Text color={`$${color}Foreground`}>{message}</Text>}
    </View>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { toasts } = useToast();

  return (
    <>
      {children}
      {toasts.map(({ id, title, color, message, open = false }, i) => (
        <Toast key={id} open={open} title={title} message={message} color={color} offsetTop={i * 100} />
      ))}
    </>
  );
};

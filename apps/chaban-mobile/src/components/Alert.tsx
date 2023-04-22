import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text } from 'react-native';
import { theme } from '../const/theme';

type AlertProps = {
  text: string;
  visible: boolean;
  type?: 'error' | 'success';
  duration?: number;
  onAnimationEnd?: () => void;
};

const Alert: React.FC<AlertProps> = ({ text, type = 'error', visible, duration = 3000, onAnimationEnd }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      easing: Easing.out(Easing.cubic),
      toValue: 300,
      useNativeDriver: true,
      duration: 340,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      easing: Easing.in(Easing.ease),
      toValue: 0,
      useNativeDriver: true,
      duration: 340,
    }).start(onAnimationEnd);
  };

  useEffect(() => {
    if (visible) {
      fadeIn();
      const timer = setTimeout(fadeOut, duration);
      return () => clearTimeout(timer);
    } else {
      fadeOut();
    }
  }, [visible]);

  let color = theme.colors.error.main;
  switch (type) {
    case 'success':
      color = theme.colors.success.main;
      break;
    case 'error':
      color = theme.colors.error.main;
      break;
    default:
      color = theme.colors.success.main;
      break;
  }
  return (
    <Animated.View // Special animatable View
      style={{
        top: -200,
        position: 'absolute',
        backgroundColor: color,
        paddingVertical: 12,
        borderRadius: 8,
        alignSelf: 'center',
        paddingHorizontal: 16,
        zIndex: 1000,
        transform: [
          {
            translateY: fadeAnim,
          },
        ],
      }}>
      <Text style={{ color: 'white' }}>{text}</Text>
    </Animated.View>
  );
};

export default Alert;

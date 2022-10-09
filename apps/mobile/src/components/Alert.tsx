import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, TouchableOpacity } from 'react-native';

type AlertProps = {
  text: string;
  visible: boolean;
  type?: 'error' | 'success';
  duration?: number;
  onAnimationEnd?: () => void;
};

const Alert: React.FC<AlertProps> = ({ text, type = 'error', visible, duration = 2000, onAnimationEnd }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      easing: Easing.out(Easing.cubic),
      toValue: 260,
      useNativeDriver: true,
      duration: 250,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      easing: Easing.in(Easing.ease),
      toValue: 0,
      useNativeDriver: true,
      duration: 250,
    }).start(onAnimationEnd);
  };

  useEffect(() => {
    if (visible) {
      fadeIn();
      //   const timer = setTimeout(fadeOut, duration);
      //   return () => clearTimeout(timer);
    } else {
      fadeOut();
    }
  }, [visible]);

  let color = '#F26666';
  switch (type) {
    case 'success':
      color = '#44B278';
      break;
    case 'error':
      color = '#F26666';
      break;
    default:
      color = '#44B278';
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
      <TouchableOpacity
        style={{ height: 24, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        onPress={fadeOut}>
        <Text style={{ color: 'white' }}>Close</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Alert;

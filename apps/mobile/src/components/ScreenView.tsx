import { Status, useCurrentStatus } from 'core';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useColorScheme,
  ViewProps,
} from 'react-native';
import { Theme } from 'src/const/theme';
import styled from 'styled-components/native';
import { BridgeEvent } from '../../App';
import { BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { Header } from './Header';

type ScreenContainerProps = {
  color?: keyof Theme['colors'];
  dark: boolean;
};
const ScreenContainer = styled.View<ScreenContainerProps & ViewProps>`
  flex: 1;
  flex-direction: column;
  background-color: ${({ dark, color = 'success', theme }) =>
    dark ? theme.colors[color].dark : theme.colors[color].main};
`;

const StatusContainer = styled.View`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  align-items: center;
  justify-content: center;
`;

type ScreenViewProps = {
  datas: BridgeEvent[];
  enableNotifications: boolean;
  onToggleNotifications: () => void;
  loading: boolean;
};

const colorPicker: Record<Status, keyof Theme['colors']> = {
  OPEN: 'success',
  WILL_CLOSE: 'warning',
  CLOSED: 'error',
};
const windowHeight = Dimensions.get('window').height;

export const ScreenView: React.FC<ScreenViewProps> = ({
  loading,
  datas,
  enableNotifications,
  onToggleNotifications,
}) => {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark';
  const status = useCurrentStatus(datas[0]?.closeAt, datas[0]?.openAt);
  const offset = useRef(new Animated.Value(0)).current;
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Animated.event([{ nativeEvent: { contentOffset: { y: offset } } }], { useNativeDriver: false })(event);
  };

  const opacity = offset.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    easing: Easing.quad,
  });

  const translateY = offset.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 10],
    extrapolate: 'clamp',
    easing: Easing.cubic,
  });

  return (
    <ScreenContainer dark={dark} color={colorPicker[status]}>
      <StatusContainer>
        <Animated.View
          style={{
            opacity,
            transform: [{ translateY }],
          }}>
          <BridgeStatus dark={dark} event={datas[0]} />
        </Animated.View>
      </StatusContainer>
      <Header
        loading={loading}
        dark={dark}
        enableNotifications={enableNotifications}
        onToggleNotifications={onToggleNotifications}
      />
      <FlatList
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={{ paddingTop: windowHeight - 185, paddingLeft: 20, paddingRight: 20 }}
        data={datas}
        keyExtractor={(item) => item.closeAt.getTime().toString()}
        renderItem={({ item }) => <BridgeEventItem dark={dark} key={item.closeAt.getTime()} {...item} />}
      />
    </ScreenContainer>
  );
};

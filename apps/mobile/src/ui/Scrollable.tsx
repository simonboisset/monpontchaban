import { ReactNode } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, RefreshControl } from 'react-native';
import { ScrollView, StackProps, YStack } from 'tamagui';

export type ScrollEvent = NativeSyntheticEvent<NativeScrollEvent>;

type ScrollableProps = {
  children: ReactNode;
  refreshing?: boolean;
  onScroll?: (event: ScrollEvent) => void;
  scrollEventThrottle?: number;
  onRefresh?: () => void;
} & StackProps;

export const Scrollable = ({
  children,
  onRefresh,
  bg,
  onScroll,
  scrollEventThrottle,
  refreshing,
  ...props
}: ScrollableProps) => {
  return (
    <YStack
      bg={bg}
      animateOnly={['opacity', 'transform']}
      animation={'lazy'}
      enterStyle={{
        opacity: 0,
        transform: [{ translateY: 20 }],
      }}
      exitStyle={{
        opacity: 0,
        transform: [{ translateY: -20 }],
      }}
      opacity={1}
      transform={[{ translateY: 0 }]}>
      <ScrollView
        minHeight={'100%'}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        refreshControl={<RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />}
        keyboardDismissMode='on-drag'
        keyboardShouldPersistTaps='handled'
        automaticallyAdjustKeyboardInsets>
        <YStack mx='auto' flex={1} maxWidth={800} w='100%' {...props}>
          {children}
        </YStack>
      </ScrollView>
    </YStack>
  );
};

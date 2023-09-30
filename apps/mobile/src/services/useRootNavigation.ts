import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStack } from '../screens/Navigator';

export const useRootNavigation = () => useNavigation<NavigationProp<RootStack>>();

export type RootNavigationProps<RouteName extends keyof RootStack = keyof RootStack> = RouteName extends unknown
  ? undefined extends RootStack[RouteName]
    ? [screen: RouteName] | [screen: RouteName, params: RootStack[RouteName]]
    : [screen: RouteName, params: RootStack[RouteName]]
  : never;

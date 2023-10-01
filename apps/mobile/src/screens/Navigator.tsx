import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootPage from './root';
import RuleSettings from './rule';
import Settings from './settings';

export const Navigator = () => {
  return (
    <Stack.Navigator initialRouteName='Root' screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Root' component={RootPage} />
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='NotificationRule' component={RuleSettings} />
    </Stack.Navigator>
  );
};

export type RootStack = {
  Root: undefined;
  Settings: undefined;
  NotificationRule: { id: string };
};

const Stack = createNativeStackNavigator<RootStack>();

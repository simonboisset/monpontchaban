import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { init } from '@aptabase/react-native';
import packages from './package.json';

init('A-EU-5247288806', { appVersion: packages.version });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);

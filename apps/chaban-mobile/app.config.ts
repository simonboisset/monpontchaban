import type { ConfigContext, ExpoConfig } from '@expo/config';
import { config } from 'dotenv';
import packages from './package.json';

config();
const getAndroidVersionCode = (version: any) => {
  let [major, minor, patch] = version.split('.');
  if (major.length === 1) {
    major = `0${major}`;
  }
  if (minor.length === 1) {
    minor = `0${minor}`;
  }
  if (patch.length === 1) {
    patch = `0${patch}`;
  }
  return Number(`420${major}${minor}${patch}`);
};

const versionCode = getAndroidVersionCode(packages.version);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Mon Pont Chaban',
  owner: 'lezo',
  scheme: 'monpontchaban',
  slug: 'mon-pont-chaban',
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#84a59d',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/f4033f91-933d-4f91-ae6d-6f8483abf08e',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#84a59d',
    },
    buildNumber: packages.version,
    supportsTablet: true,
    bundleIdentifier: 'app.lezo.monpontchaban',
  },
  android: {
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#84a59d',
    },
    permissions: [],
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#84a59d',
    },
    versionCode,
    package: 'com.simonboisset.monpontchaban',
    googleServicesFile: './google-services.json',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: 'f4033f91-933d-4f91-ae6d-6f8483abf08e',
    },
    API_URL: process.env.API_URL || null,
    CHABAN_CHANNEL_ID: process.env.CHABAN_CHANNEL_ID || null,
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#ffffff',
      },
    ],
  ],
});

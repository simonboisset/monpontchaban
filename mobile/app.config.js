import 'dotenv/config';
import packages from './package.json';

const getAndroidVersionCode = (version) => {
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

export default {
  name: 'Mon Pont Chaban',
  slug: 'mon-pont-chaban',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#84a59d',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
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
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: process.env.SENTRY_ORGANIZATION,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
        },
      },
    ],
  },
  extra: {
    SENTRY_DSN: process.env.SENTRY_DSN,
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
};

import 'dotenv/config';
import app from './app.json';

export default {
  ...app.expo,
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
};

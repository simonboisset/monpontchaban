import monitor from 'monitor';
import { Platform } from 'react-native';
import { getConfig } from './getConfig';

export const chabanMonitor = () => {
  const { KAFKA_PASSWORD, KAFKA_URL, KAFKA_USERNAME, CHANNEL } = getConfig();
  return monitor({
    url: KAFKA_URL,
    username: KAFKA_USERNAME,
    password: KAFKA_PASSWORD,
    topic: 'CHABAN',
    application: 'mobile',
    channel: CHANNEL,
    platform: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
  });
};

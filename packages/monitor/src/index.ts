import { any, date, InferSchema, object, oneOf, optional, string, validate } from '@ts-v/kit';
import { Kafka } from '@upstash/kafka';

type MonitorConfig = {
  url: string;
  username: string;
  password: string;
  platform: Platform;
  application: string;
  channel: string;
  topic?: string;
};

const monitor = (config: MonitorConfig) => {
  const kafka = new Kafka({
    url: config.url,
    username: config.username,
    password: config.password,
  });

  const topic = config.topic || 'CHABAN';

  const send = (level: Level, context: string, data?: any, user?: string) => {
    try {
      const producer = kafka.producer();
      const message = validate(
        {
          createdAt: new Date(),
          level,
          context,
          user,
          data,
          platform: config.platform,
          channel: config.channel,
          application: config.application,
        },
        messageSchema,
      );
      return producer.produce(topic, message);
    } catch (error) {
      console.error('[Monitor send] Message not sent: ', JSON.stringify(error));
    }
  };
  const errorBoundary = async <T, E = undefined>(
    message: string,
    callback: () => Promise<T>,
    onError?: (error: any) => Promise<E>,
  ): Promise<T | E> => {
    try {
      const res = await callback();
      return res;
    } catch (error) {
      send('EXCEPTION', message, JSON.stringify(error));
      if (onError) {
        return onError(error);
      }
      return undefined as E;
    }
  };
  const log = (message: string, data?: any) => {
    return send('LOG', message, JSON.stringify(data || {}));
  };
  const debug = (message: string, data?: any) => {
    return send('DEBUG', message, JSON.stringify(data || {}));
  };
  const info = (message: string, data?: any) => {
    return send('INFO', message, JSON.stringify(data || {}));
  };
  const warn = (message: string, data?: any) => {
    return send('WARNING', message, JSON.stringify(data || {}));
  };
  const error = (message: string, data?: any) => {
    return send('ERROR', message, JSON.stringify(data || {}));
  };
  const request = (route: string, user?: string, param?: any) => {
    return send('REQUEST', route, JSON.stringify(param || {}), user);
  };

  const consume = async () => {
    const consumer = kafka.consumer();
    const messages = await consumer.consume({ consumerGroupId: 'group_1', instanceId: 'instance_1', topics: [topic] });
    let mapper: Message[] = [];
    for (const message of messages) {
      try {
        const value = validate(JSON.parse(message.value), messageSchema);
        mapper.push(value);
      } catch (error) {}
    }
    return mapper;
  };
  return { log, debug, warn, info, error, errorBoundary, request, consume };
};

const level = oneOf(['LOG', 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'EXCEPTION', 'REQUEST']);
export type Level = InferSchema<typeof level>;

const platform = oneOf(['NODE', 'BROWSER', 'ANDROID', 'IOS']);
export type Platform = InferSchema<typeof platform>;

const messageSchema = object({
  createdAt: date(),
  user: optional(string()),
  level: level,
  data: any,
  context: string(),
  platform: platform,
  application: string(),
  channel: string(),
});
export type Message = InferSchema<typeof messageSchema>;

export default monitor;

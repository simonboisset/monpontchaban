import dayjs from 'dayjs';
import { BridgeEvent } from '~/components/BridgeEventItem';

export const filterNextBridgeEvents =
  (now: Date) =>
  ({ openAt }: BridgeEvent): boolean =>
    dayjs(now).isBefore(openAt);

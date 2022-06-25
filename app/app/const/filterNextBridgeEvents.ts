import dayjs from 'dayjs';
import type { BridgeEvent } from '~/components/BridgeEventItem';

export const filterNextBridgeEvents =
  (now: Date) =>
  ({ openAt }: BridgeEvent): boolean =>
    dayjs(now).isBefore(openAt);

import dayjs from 'dayjs';
import type { BridgeEvent } from '~/components/BridgeEventItem';

export const filterNextBridgeEvents =
  (now: string) =>
  ({ openAt }: BridgeEvent): boolean =>
    dayjs(now).isBefore(openAt);

import dayjs from 'dayjs';
import { BridgeEvent } from '../api/BridgeEvent';

export const filterNextBridgeEvents =
  (now: Date) =>
  ({ openAt }: BridgeEvent): boolean =>
    dayjs(now).isBefore(openAt);

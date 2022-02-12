import React from 'react';
import useCurrentStatus from '~/hooks/useCurrentStatus';
import { BridgeEvent, BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { Header } from './Header';

type ScreenViewProps = { datas: BridgeEvent[] };

export const ScreenView: React.FC<ScreenViewProps> = ({ datas }) => {
  const status = useCurrentStatus(datas[0]?.closeAt, datas[0]?.openAt);

  return (
    <div
      className={
        (status === 'OPEN' ? 'bg-[#84a59d]' : status === 'WILL_CLOSE' ? 'bg-[#f6bd60]' : 'bg-[#f28482]') +
        ' flex h-screen'
      }>
      <Header />
      <div className='flex flex-row w-screen'>
        <div className='py-20 pr-20 pl-10 flex grow'>
          <BridgeStatus event={datas[0]} />
        </div>
        <div className='flex w-3/12 flex-col p-10 overflow-y-scroll space-y-5'>
          {datas.map((data) => (
            <BridgeEventItem key={data.closeAt.getTime()} {...data} />
          ))}
        </div>
      </div>
    </div>
  );
};

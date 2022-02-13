import React, { useState } from 'react';
import useCurrentStatus from '~/hooks/useCurrentStatus';
import { BridgeEvent, BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { Header } from './Header';

type ScreenViewProps = { datas: BridgeEvent[] };

export const ScreenView: React.FC<ScreenViewProps> = ({ datas }) => {
  const status = useCurrentStatus(datas[0]?.closeAt, datas[0]?.openAt);
  const [opacity, setOpacity] = useState('opacity-100');

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (e.currentTarget.scrollTop > 100) {
      setOpacity('opacity-0');
    } else {
      setOpacity('opacity-100');
    }
  };

  return (
    <div
      className={
        (status === 'OPEN' ? 'bg-[#84a59d]' : status === 'WILL_CLOSE' ? 'bg-[#f6bd60]' : 'bg-[#f28482]') +
        ' flex h-screen'
      }>
      <div className='flex md:flex-row flex-col w-screen items-center md:items-start'>
        <div className='flex grow h-screen justify-center absolute md:static'>
          <div className={'flex flex-col w-full md:max-w-2xl max-w-md'}>
            <Header />
            <div
              className={
                opacity +
                ' md:opacity-100 transition-opacity duration-500 flex grow flex-col items-center justify-center'
              }>
              <BridgeStatus event={datas[0]} />
            </div>
          </div>
        </div>

        <div className='overflow-y-scroll md:max-w-md w-full h-screen z-10' onScroll={handleScroll}>
          <div
            className={
              (status === 'OPEN' ? 'bg-[#84a59d]' : status === 'WILL_CLOSE' ? 'bg-[#f6bd60]' : 'bg-[#f28482]') +
              ' h-20 md:h-0 fixed  w-full z-10'
            }
          />
          <div className='h-full md:h-0' />
          <div className='flex flex-col items-center'>
            <div className='flex w-full flex-col p-5 space-y-5 -translate-y-40 md:translate-y-20 max-w-md'>
              {datas.map((data) => (
                <BridgeEventItem key={data.closeAt.getTime()} {...data} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

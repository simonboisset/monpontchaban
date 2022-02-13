import React, { useState } from 'react';
import useCurrentStatus from '~/hooks/useCurrentStatus';
import { Android } from './Android';
import { BridgeEvent, BridgeEventItem } from './BridgeEventItem';
import { BridgeStatus } from './BridgeStatus';
import { GithubLogo } from './GithubLogo';
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
              ' h-16 fixed  w-full z-10'
            }
          />
          <a
            className='w-8 cursor-pointer h-8 text-white absolute top-5 right-16 z-40'
            href='https://play.google.com/store/apps/details?id=com.simonboisset.monpontchaban'>
            <Android />
          </a>
          <a
            className='w-8 cursor-pointer h-8 text-white absolute top-5 right-4 z-40'
            href='https://github.com/simonboisset/chaban-delmas-bridge'>
            <GithubLogo />
          </a>
          <div className='h-full md:h-0' />
          <div className='flex flex-col items-center'>
            <div className='flex w-full flex-col p-5 space-y-5 -mt-40 md:mt-20 max-w-md'>
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

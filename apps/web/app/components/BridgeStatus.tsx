import { Timer, fr } from '@chaban/chaban-core';
import { useRoot } from '~/domain/theme';
import { ClosedLogo } from './ClosedLogo';
import { OpenedLogo } from './OpenedLogo';

export const BridgeStatus = () => {
  const { currentStatus, alerts } = useRoot();
  const nextAlert = alerts[0];
  return (
    <section className='flex flex-row relative items-center bg-background/30 rounded-lg shadow-md'>
      <div className='bg-primary/5 p-4 items-center rounded-md'>
        {currentStatus === 'CLOSED' ? (
          <ClosedLogo className='aspect-square w-24' />
        ) : (
          <OpenedLogo className='aspect-square w-24' />
        )}
      </div>
      <p className='sm:text-4xl text-2xl font-bold flex-1 absolute top-0 bottom-0 left-32 lg:right-32 right-0 flex flex-col md:flex-row justify-center items-center gap-4'>
        <span>
          {currentStatus === 'CLOSED' ? fr.reopenIn : currentStatus === 'WILL_CLOSE' ? fr.closeIn : fr.opened}
        </span>
        {currentStatus === 'CLOSED' ? (
          <span>
            <Timer date={nextAlert.endAt} />
          </span>
        ) : (
          currentStatus === 'WILL_CLOSE' && (
            <span>
              <Timer date={nextAlert.startAt} />
            </span>
          )
        )}
      </p>
    </section>
  );
};

import React from 'react';
import { fr } from '~/const/translation';

export const Header: React.FC = () => {
  return (
    <div className='flex flex-row w-full p-4 items-center justify-center text-white text-3xl z-20'>
      <div className='grow flex justify-center'>{fr.MyChaban}</div>
    </div>
  );
};

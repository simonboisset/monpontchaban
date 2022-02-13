import React from 'react';
import { fr } from '~/const/translation';

export const Header: React.FC = () => {
  return (
    <div className='z-20 flex flex-row w-full p-4 items-center justify-center text-white text-3xl'>{fr.MyChaban}</div>
  );
};

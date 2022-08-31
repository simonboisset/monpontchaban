import { fr } from 'core';
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className='flex flex-row w-full p-4 items-center justify-center text-lg sm:text-3xl z-20'>
      <h1 className='grow flex justify-center'>{fr.MyChaban}</h1>
    </header>
  );
};

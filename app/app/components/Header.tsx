import React from 'react';
import { fr } from '~/const/translation';

export const Header: React.FC = () => {
  return (
    <div className=' flex flex-row absolute ml-40 w-80 p-4 items-center justify-center drop-shadow-lg rounded-b-full h-15 bg-white text-2xl'>
      {fr.MyChaban}
    </div>
  );
};

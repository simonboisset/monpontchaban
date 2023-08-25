import { fr } from '@lezo-alert/chaban-core';
import { Theme } from '~/hooks/useDarkMode';

export const Header = ({ theme, toggleTheme }: { toggleTheme: () => void; theme: Theme }) => {
  return (
    <header className='fixed w-full flex flex-row top-0 left-0 right-0 p-4 gap-4 items-center text-lg sm:text-3xl backdrop-blur-lg z-30 bg-gray-800 bg-opacity-20'>
      <h1 className='grow flex'>{fr.MyChaban}</h1>
      {/* <button className='w-6 sm:w-8 cursor-pointer h-8 sm:right-4 z-40 flex items-center' onClick={toggleTheme}>
        {theme === 'dark' ? <Moon /> : <Sun />}
      </button> */}
    </header>
  );
};

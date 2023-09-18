import { Link, Outlet } from '@remix-run/react';
import { Facebook, Moon, Sun } from 'lucide-react';
import { OpenedLogo } from '~/components/OpenedLogo';
import { useRoot } from '~/domain/theme';
import { cn } from '~/utils';

export default function PublicPage() {
  const { theme, toggle, currentStatus, alerts } = useRoot();
  return (
    <>
      <header
        className={cn(
          'fixed w-full flex flex-row top-0 left-0 right-0 p-4 gap-4 items-center',
          'text-lg sm:text-3xl backdrop-blur-lg z-30',
        )}>
        <Link to='/' className='bg-primary-foreground/10 p-2 items-center rounded-lg flex flex-row gap-4'>
          <OpenedLogo className='h-8 aspect-square' />
          <h4 className='grow text-2xl font-bold sm:inline hidden'>Mon Pont Chaban</h4>
        </Link>
        <div className='flex-1' />
        {/* <Button asChild variant='light' size='sm' className='text-sm'>
          <Link to='/blog' className='text-sm'>
            Blog
          </Link>
        </Button> */}

        <Link
          aria-label='Facebook'
          to='https://www.facebook.com/monpontchaban'
          className={cn(
            'cursor-pointer sm:right-4 z-40 flex items-center justify-center p-2',
            'bg-primary-foreground/0 hover:bg-primary-foreground/10 transition-all rounded-full',
          )}>
          <Facebook className='w-6 h-6' />
        </Link>
        <button
          className={cn(
            'cursor-pointer sm:right-4 z-40 flex items-center justify-center p-2',
            'bg-primary-foreground/0 hover:bg-primary-foreground/10 transition-all rounded-full',
          )}
          onClick={toggle}>
          {theme === 'dark' ? <Moon className='w-6 h-6' /> : <Sun className='w-6 h-6' />}
        </button>
      </header>
      <main className='flex flex-col flex-1 pt-32 px-8 mx-auto w-full max-w-screen-lg'>
        <Outlet />
      </main>
      <footer className='w-full p-4 mt-12 bg-background/30'>
        <div className='flex sm:flex-row gap-8 flex-col justify-between items-center w-full max-w-screen-lg mx-auto'>
          <div className='flex flex-col gap-2 flex-1 sm:items-start items-center'>
            <h4 className='text-lg font-bold'>Site</h4>
            <Link to='/' className='text-sm'>
              Accueil
            </Link>
            {/* <Link to='/blog' className='text-sm'>
              Blog
            </Link> */}
          </div>
          <div className='flex flex-col gap-2 flex-1 items-center'>
            <h4 className='text-lg font-bold'>Docs</h4>
            <Link className='text-sm' to='/docs/legal'>
              Mentions légales
            </Link>
            <Link className='text-sm' to='/docs/privacy'>
              Politique de confidentialité
            </Link>
          </div>
          <div className='flex flex-col gap-2 flex-1 sm:items-end items-center'>
            <div className='flex flex-col gap-2 sm:items-start items-center'>
              <h4 className='text-lg font-bold'>Liens</h4>
              <Link className='text-sm' to='https://www.facebook.com/monpontchaban'>
                Facebook
              </Link>
              <Link className='text-sm' to='https://lezo.dev'>
                Lezo
              </Link>
              <Link className='text-sm' to='https://apps.apple.com/app/mon-pont-chaban/id6448217836'>
                Application iOS
              </Link>
              <Link
                className='text-sm'
                to='https://play.google.com/store/apps/details?id=com.simonboisset.monpontchaban'>
                Application Android
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

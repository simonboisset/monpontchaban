import { Link, Outlet } from '@remix-run/react';
export default function Docs() {
  return (
    <div className='bg-green w-screen py-44 px-12'>
      <Link to='/' className='absolute top-8 left-8 text-greenDark font-bold'>
        Retour
      </Link>
      <div className=' prose mx-auto  prose-headings:text-greenDark prose-p:text-greenDark prose-li:text-greenDark prose-p:text-justify prose-a:underline prose-a:font-bold prose-a:text-greenDark prose-li:marker:text-greenDark'>
        <Outlet />
      </div>
    </div>
  );
}

import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

import Logo from './Logo';

import { useUser } from '../../lib/UserContext';
import { ShoppingCartIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="mx-auto flex max-w-screen-2xl items-center bg-white px-5 py-3">
      <div className="mr-8">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
      <div className="flex w-full items-center justify-between">
        <nav>
          {user ? (
            <ul>
              <li className="inline">
                <Link href="/order-management">
                  <a className="text-xl font-semibold text-black hover:text-gray-400">Orders</a>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-x-6">
              <li className="inline">
                <Link href="/sign-up/consumer">
                  <a className="text-xl font-semibold text-black hover:text-gray-400">
                    Register Today
                  </a>
                </Link>
              </li>
              <li className="inline">
                <Link href="/sign-up/chef">
                  <a className="text-xl font-semibold text-black hover:text-gray-400">
                    Become a Chef
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </nav>
        <div className="flex items-center gap-x-6">
          {user && (
            <Link href="/order-management/checkout">
              <a className="flex text-xl font-semibold text-black">
                <ShoppingCartIcon className="h-8 w-8 stroke-2 pr-2" />
                {/* TODO: Remove tmeporary number */}
              </a>
            </Link>
          )}
          <Link href="/help">
            <a className="text-xl font-semibold text-black">Help</a>
          </Link>
          {user && (
            <button
              className="rounded-lg border-green-light bg-green-light px-6 py-1 text-xl font-semibold text-white hover:border-green-hover hover:bg-green-hover"
              onClick={async (e) => {
                e.preventDefault();
                const { error } = await supabase.auth.signOut();
                if (error) {
                  document.getElementById('loginErrorField')!.innerHTML = error.message;
                  throw error;
                }
                router.push('/signin');
              }}
            >
              Logout
            </button>
          )}

          <Link href={user ? '/profile' : '/signin'}>
            <a className="rounded-lg border-green-light bg-green-light px-6 py-1 text-xl font-semibold text-white hover:border-green-hover hover:bg-green-hover">
              {user ? <span>Profile</span> : <span>Log In</span>}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

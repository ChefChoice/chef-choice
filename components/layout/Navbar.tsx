import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

import Logo from './Logo';

import { useUser } from '../../lib/UserContext';

const Navbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="flex items-center max-w-screen-2xl mx-auto px-5 py-3 bg-white">
      <div className="mr-8">
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
      <div className="flex items-center justify-between w-full">
        <nav>
          {user ? (
            <ul>
              <li className="inline">
                <Link href="/order-management">
                  <a className="text-black font-semibold text-xl hover:text-gray-400">Orders</a>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-x-6">
              <li className="inline">
                <Link href="/sign-up/consumer">
                  <a className="text-black font-semibold text-xl hover:text-gray-400">
                    Register Today
                  </a>
                </Link>
              </li>
              <li className="inline">
                <Link href="/sign-up/chef">
                  <a className="text-black font-semibold text-xl hover:text-gray-400">
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
              <a className="text-black font-semibold text-xl">Cart</a>
            </Link>
          )}
          <Link href="/help">
            <a className="text-black font-semibold text-xl">Help</a>
          </Link>
          {user && (
            <button
              className="text-white font-semibold text-xl px-6 py-1 rounded-lg border-green-light hover:border-green-hover bg-green-light hover:bg-green-hover"
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
            <a className="text-white font-semibold text-xl px-6 py-1 rounded-lg border-green-light hover:border-green-hover bg-green-light hover:bg-green-hover">
              {user ? <span>Profile</span> : <span>Log In</span>}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

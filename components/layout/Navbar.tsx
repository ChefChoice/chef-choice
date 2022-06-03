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
          <ul>
            <li>
              {user ? (
                <Link href="/order-management">
                  <a className="text-black font-semibold text-xl">Orders</a>
                </Link>
              ) : (
                <Link href="#">
                  <a className="text-black font-semibold text-xl">Become a Chef</a>
                </Link>
              )}
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-x-8">
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
              className="block max-w-sm bg-green-light hover:bg-green-hover py-2 px-2 text-white rounded w-full"
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
            <a className="text-white font-semibold text-xl px-6 py-1 border-none rounded-lg bg-green-light">
              {user ? <span>Profile</span> : <span>Log In</span>}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

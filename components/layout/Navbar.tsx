import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Logo from './Logo';

// Added user authorization
// TODO: Add user type check

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(supabase.auth.user());
  }, []);

  return (
    <div className="flex items-center max-w-screen-2xl mx-auto px-5 py-3 bg-white">
      <div className="mr-8">
        <Link href="/main-menu">
          <a>
            <Logo />
          </a>
        </Link>
      </div>

      <div className="flex items-center justify-between w-full">
        <nav>
          <ul>
            {user ? (
              <li>
                <Link href="/main-menu">
                  <a className="text-black font-semibold text-xl px-5">Home</a>
                </Link>

                <Link href="/">
                  <a className="text-black font-semibold text-xl px-5">Orders</a>
                </Link>

                <Link href="/marketplace">
                  <a className="text-black font-semibold text-xl">Marketplace</a>
                </Link>
              </li>
            ) : (
              <li>
                <Link href="/">
                  <a className="text-black font-semibold text-xl">Become a Chef</a>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-x-8">
          <Link href="#">
            <a className="text-black font-semibold text-xl">Help</a>
          </Link>
          {user ? (
            <>
              <Link href="#">
                <a className="text-black font-semibold text-xl">Logout</a>
              </Link>
              <Link href="/profile">
                <a className="text-white font-semibold text-xl px-6 py-1 border-none rounded-lg bg-green-light">
                  Profile
                </a>
              </Link>
            </>
          ) : (
            <Link href="/signin">
              <a className="text-white font-semibold text-xl px-6 py-1 border-none rounded-lg bg-green-light">
                Log In
              </a>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

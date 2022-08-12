import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { supabase } from '../../utils/supabaseClient';
import { useUser } from '../../lib/UserContext';

import Logo from './Logo';
import { SearchIcon, ShoppingCartIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

const Navbar = () => {
  const { user, isHomeChef, isAdmin } = useUser();
  const [itemNumber, setItemNumber] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // TODO: Get cart number to change realtime
    // getCart('P');
  }, []);

  const getCart = async (status: string) => {
    try {
      const response = await axios.get(`/api/order-management/orders/${status}`);

      const orders = response.data.orders;
      const filteredOrders = orders.filter((order: any) => order.cart);

      if (filteredOrders.length > 0) {
        const response = await axios.get(`/api/order-management/quantity/${filteredOrders[0].id}`);
        setItemNumber(response.data.quantity);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full shadow-md">
      <nav className="bg-white">
        <div className=" mx-auto max-w-screen-2xl items-center justify-between bg-white py-4 px-7 md:flex md:px-10">
          <div className="flex items-center text-2xl">
            <Link href="/">
              <a className="mr-1">
                <Logo />
              </a>
            </Link>
          </div>
          <div
            className="absolute right-8 top-4 cursor-pointer md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <XIcon className="h-8 w-8 stroke-2"></XIcon>
            ) : (
              <MenuIcon className="h-8 w-8 stroke-2"></MenuIcon>
            )}
          </div>
          <ul
            className={`absolute left-0 w-full bg-white pb-12 pl-8 opacity-0 transition-all duration-500 ease-in md:static md:z-auto md:flex md:w-full md:items-center md:justify-end md:pb-0 md:pl-0 md:opacity-100 ${
              open ? 'top-15 opacity-100' : 'top-[-490px]'
            }`}
          >
            <li className="mr-auto mt-5 md:ml-4 md:mt-0">
              {isAdmin ? (
                <></>
              ) : user && !isAdmin ? (
                <ul>
                  <li className="inline">
                    <Link href="/order-management">
                      <a className="text-xl font-semibold text-black hover:text-gray-400">Orders</a>
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="md:flex md:gap-x-6">
                  <li className="mb-4 md:mb-0">
                    <Link href="/sign-up/consumer">
                      <a className="text-xl font-semibold text-black hover:text-gray-400">
                        Register Today
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/sign-up/chef">
                      <a className="text-xl font-semibold text-black hover:text-gray-400">
                        Become a Chef
                      </a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              {user && !isHomeChef && !isAdmin && (
                <Link href="/order-management/checkout">
                  <a className="mt-4 flex text-xl font-semibold text-black md:mt-0 md:mr-4">
                    {itemNumber > 0 && <div>{itemNumber}</div>}
                    <ShoppingCartIcon className="h-8 w-8 stroke-2 pr-2" />
                  </a>
                </Link>
              )}
            </li>
            <li className="mt-4 md:mt-0">
              <Link href="/search">
                <a>
                  <SearchIcon className="h-6 w-6 text-black" />
                </a>
              </Link>
            </li>
            <li className="my-4 md:my-0 md:ml-6">
              <Link href="/">
                <a className="text-xl font-semibold text-black hover:text-gray-400">Help</a>
              </Link>
            </li>
            <li className="mb-4 md:mb-0">
              {user && (
                <button
                  className="rounded-lg border-green-light bg-green-light px-6 py-1 text-xl font-semibold text-white hover:border-green-hover hover:bg-green-hover md:ml-6"
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
            </li>
            <li>
              <Link
                href={
                  user && !isAdmin
                    ? '/profile'
                    : user && isAdmin
                    ? '/admin/admin-dashboard'
                    : '/signin'
                }
              >
                <a className="rounded-lg border-green-light bg-green-light px-6 py-[7px] text-xl font-semibold text-white hover:border-green-hover hover:bg-green-hover md:ml-6">
                  {user && !isAdmin ? (
                    <span>Profile</span>
                  ) : user && isAdmin ? (
                    <span>Dashboard</span>
                  ) : (
                    <span>Log In</span>
                  )}
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

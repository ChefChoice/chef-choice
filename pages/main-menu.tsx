import { User, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useUser } from '../lib/UserContext';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function MainMenu() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const { user: userSession, isHomeChef, isAdmin } = useUser();
  const [userType, setUserType] = useState<string | null>(null);
  // const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    getUsername();
  }, [user, isHomeChef, isAdmin]);

  async function getUsername() {
    try {
      setUser(supabase.auth.user());

      if (user) {
        if (isAdmin) {
          const {
            data: adminData,
            error: adminError,
            status: adminStatus,
          } = await supabase
            .from('Admin')
            .select('name')
            // select by id
            .eq('id', user['id'])
            .single();

          if (adminError && adminStatus !== 406) {
            throw adminError;
          }

          if (adminData) {
            setUsername(adminData.name);
            setUserType('admin');

            console.log(username);
            setLoading(true);
          }
        } else {
          if (isHomeChef) {
            const {
              data: homeChefData,
              error: homeChefError,
              status: homeChefStatus,
            } = await supabase
              .from('HomeChef')
              .select('name')
              // select by id
              .eq('id', user['id'])
              .single();

            if (homeChefError && homeChefStatus !== 406) {
              throw homeChefError;
            }

            if (homeChefData) {
              setUsername(homeChefData.name);
              setUserType('homechef');

              setLoading(true);
            }
          } else {
            const {
              data: consumerData,
              error: consumerError,
              status: consumerStatus,
            } = await supabase
              .from('Consumer')
              .select('name')
              // select by id
              .eq('id', user['id'])
              .single();

            if (consumerError && consumerStatus !== 406) {
              throw consumerError;
            }

            if (consumerData) {
              setUsername(consumerData.name);
              setUserType('consumer');

              setLoading(true);
            }
          }
        }
      }
      // if (user && isHomeChef) {
      //   let {
      //     data: homeChefData,
      //     error: homeChefError,
      //     status: homeChefStatus,
      //   } = await supabase
      //     .from('HomeChef')
      //     .select('name')
      //     // select by id
      //     .eq('id', user['id'])
      //     .single();

      //   if (homeChefError && homeChefStatus !== 406) {
      //     throw homeChefError;
      //   }

      //   if (homeChefData) {
      //     setUsername(homeChefData.name);
      //     setUserType('homechef');

      //     setLoading(true);
      //   }
      // }
      // if (user && !isHomeChef && !admin) {
      //   let {
      //     data: consumerData,
      //     error: consumerError,
      //     status: consumerStatus,
      //   } = await supabase
      //     .from('Consumer')
      //     .select('name')
      //     // select by id
      //     .eq('id', user['id'])
      //     .single();

      //   if (consumerError && consumerStatus !== 406) {
      //     throw consumerError;
      //   }

      //   if (consumerData) {
      //     setUsername(consumerData.name);
      //     setUserType('consumer');

      //     setLoading(true);
      //   }
      // }

      // // Admin
      // if (user && admin) {
      //   let {
      //     data: adminData,
      //     error: adminError,
      //     status: adminStatus,
      //   } = await supabase
      //     .from('Admin')
      //     .select('name')
      //     // select by id
      //     .eq('id', user['id'])
      //     .single();

      //   if (adminError && adminStatus !== 406) {
      //     throw adminError;
      //   }

      //   if (adminData) {
      //     setUsername(adminData.name);
      //     setUserType('admin');

      //     console.log(username);
      //     setLoading(true);
      //   }
      // }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>Main Menu</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className="background-image flex h-screen w-full flex-col items-center justify-center py-4">
          <h1 className="font-headline break-words text-3xl font-medium sm:text-4xl">
            Welcome to ChefChoice, {username ? username : ''}
            <hr className="border-t-2 border-black/[.50]" />
          </h1>

          {user && isAdmin ? (
            <div className="grid grid-flow-row grid-rows-1 justify-center pt-10">
              <Link href="/admin/admin-dashboard">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>Go to dashboard</h2>
                </a>
              </Link>
            </div>
          ) : user && userType === 'homechef' ? (
            <div className="grid grid-flow-row grid-rows-3 justify-center pt-10">
              <Link href="/order-management">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>Orders</h2>
                </a>
              </Link>
              <Link href="/marketplace">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>Marketplace Management</h2>
                </a>
              </Link>
              <Link href="/profile">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>My Account</h2>
                </a>
              </Link>
            </div>
          ) : (
            <div className="grid grid-flow-row grid-rows-3 justify-center pt-10">
              <Link href="/search">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>Search Dishes</h2>
                </a>
              </Link>
              <Link href="/order-management">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>View Orders</h2>
                </a>
              </Link>
              <Link href="/profile">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>My Account</h2>
                </a>
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

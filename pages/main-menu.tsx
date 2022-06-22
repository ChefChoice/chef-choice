import { User, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// TODO: Check user types; Add navigation for Orders and Search Dishes

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function MainMenu() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUsername();
  }, [user]);

  async function getUsername() {
    try {
      setUser(supabase.auth.user());
      if (user) {
        let { data, error, status } = await supabase
          .from('HomeChef')
          .select('name')
          // select by id
          .eq('id', user['id'])
          .single();

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setUsername(data.name);
          setLoading(true);
        }
      }
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
          <div className="grid grid-flow-row grid-rows-3 justify-center pt-10">
            {/* TODO: Change the option cards according to the type of user*/}
            {2 > 1 ? (
              <Link href="/order-management">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover sm:w-96">
                  <h2>Orders</h2>
                </a>
              </Link>
            ) : (
              <Link href="#">
                <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover">
                  <h2>Search Dishes</h2>
                </a>
              </Link>
            )}

            <Link href="/marketplace">
              <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover">
                <h2>Marketplace Management</h2>
              </a>
            </Link>

            <Link href="/profile">
              <a className="m-2 grid place-content-center rounded-lg bg-green-light p-6 text-xl text-white hover:bg-green-hover">
                <h2>My Account</h2>
              </a>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

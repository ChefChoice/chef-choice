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
  });

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
        <main className="background-image h-screen w-screen py-4 flex flex-col justify-center items-center">
          <h1 className="font-headline font-medium text-4xl break-words">
            Welcome to ChefChoice, {username ? username : ''}
            <hr style={{ borderTop: '3px solid #000000 ' }} />
          </h1>
          <div className="grid grid-rows-3 grid-flow-col gap-2 pt-10 justify-items-center items-center w-96">
            {/* TODO: Change the option cards according to the type of user*/}
            {2 > 1 ? (
              <Link href="#">
                <a className="flex justify-center items-center mx-auto py-2 px-2 bg-green-light text-white text-xl rounded-lg hover:bg-green-hover md:w-full w-3/4 h-20">
                  <h2>Orders</h2>
                </a>
              </Link>
            ) : (
              <Link href="#">
                <a className="flex justify-center items-center mx-auto py-2 px-2 bg-green-light text-white text-xl rounded-lg hover:bg-green-hover md:w-full w-3/4 h-20">
                  <h2>Search Dishes</h2>
                </a>
              </Link>
            )}

            <Link href="/marketplace">
              <a className="flex justify-center items-center mx-auto py-2 px-2 bg-green-light text-white text-xl rounded-lg hover:bg-green-hover md:w-full w-3/4 h-20">
                <h2>Marketplace Management</h2>
              </a>
            </Link>

            <Link href="/profile">
              <a className="flex justify-center items-center mx-auto py-2 px-2 bg-green-light text-white text-xl rounded-lg hover:bg-green-hover md:w-full w-3/4 h-20">
                <h2>My Account</h2>
              </a>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}

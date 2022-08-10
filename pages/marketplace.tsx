import { User, withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

// TODO: Add navigations to schedule and review

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function Marketplace() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(supabase.auth.user());
  }, [user]);

  return (
    <>
      <Head>
        <title>Marketplace</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className="background-image flex h-1/3 w-full flex-col justify-center py-4 sm:h-screen">
          <div className="grid sm:grid-cols-5">
            <h2 className="grid break-words text-3xl font-medium sm:col-span-3 sm:col-start-2">
              Marketplace Management
              <hr className="mb-5 border-t-2 border-black/[.50]" />
            </h2>
          </div>

          <div className="grid grid-cols-1 justify-center gap-2 self-center sm:w-2/5 sm:grid-cols-3">
            <div className="hover:border-green overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring ">
              <Link href="/dish-management">
                <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                  <Image
                    src="/images/dishMgt.jpg"
                    layout="responsive"
                    width={1700}
                    height={1500}
                    alt="dish image"
                  />
                  <div className="py-5 px-5 text-right">Manage Dishes</div>
                </a>
              </Link>
            </div>

            <div className="hover:border-green overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
              <Link href={`/review/${user?.id}`}>
                <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                  <Image
                    src="/images/reviewMgt.jpg"
                    layout="responsive"
                    width={2100}
                    height={1900}
                    alt="review image"
                  />

                  <div className="py-5 px-5 text-right">See Reviews</div>
                </a>
              </Link>
            </div>

            <div className="hover:border-green overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
              <Link href="/schedule">
                <a className="xs:text-xs font-bold text-white hover:text-black  lg:text-base">
                  <Image
                    src="/images/scheduleMgt.jpg"
                    layout="responsive"
                    width={1700}
                    height={1500}
                    alt="schedule image"
                  />

                  <div className="py-5 px-5 text-right">Manage Schedule</div>
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

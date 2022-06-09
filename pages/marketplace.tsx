import { User } from '@supabase/supabase-js';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import SignIn from './signin';

// TODO: Add navigations
// TODO: integrate global userContext later

export default function Marketplace() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(supabase.auth.user());
  }, []);

  return (
    <>
      {!user ? (
        <SignIn />
      ) : (
        <>
          <Head>
            <title>Marketplace</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
          </Head>

          <div className="mx-auto">
            <main className="background-image md:h-screen h-1/3  w-full py-4 px-0 flex flex-col justify-center">
              <div className="grid md:grid-cols-5 text-3xl font-headline font-medium">
                <h2 className="col-start-2 col-span-3 break-words">
                  Marketplace Management
                  <hr style={{ borderTop: '2px solid #000000' }} />
                </h2>
              </div>

              <div className="md:w-full grid md:grid-cols-5 grid-cols-1 gap-2 pl-3 pt-5 justify-center">
                <div className="max-w-xs w-full md:col-start-2 bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
                  <Image
                    src="/images/dishMgt.jpg"
                    layout="responsive"
                    width={2100}
                    height={1900}
                    alt="dish image"
                  />

                  <div className="py-5 px-5 text-right">
                    <Link href="/dish-management">
                      <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                        Manage Dishes
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
                  <Image
                    src="/images/reviewMgt.jpg"
                    layout="responsive"
                    width={2100}
                    height={1900}
                    alt="review image"
                  />

                  <div className="py-5 px-5 text-right">
                    <Link href="#">
                      <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                        Manage Reviews
                      </a>
                    </Link>
                  </div>
                </div>

                <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
                  <Image
                    src="/images/scheduleMgt.jpg"
                    layout="responsive"
                    width={2100}
                    height={1900}
                    alt="schedule image"
                  />

                  <div className="py-5 px-5 text-right">
                    <Link href="#">
                      <a className="font-bold text-white lg:text-base xs:text-xs  hover:text-black">
                        Manage Schedule
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
}

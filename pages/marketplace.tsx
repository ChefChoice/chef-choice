import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

// TODO: Add navigations to schedule and review

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

export default function Marketplace() {
  return (
    <>
      <Head>
        <title>Marketplace</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className="background-image sm:h-screen h-1/3 w-full py-4 flex flex-col justify-center">
          <div className="grid sm:grid-cols-5">
            <h2 className="grid sm:col-start-2 sm:col-span-3 font-headline font-medium sm:text-4xl text-3xl break-words">
              Marketplace Management
              <hr className="mb-5 border-t-2 border-black/[.50]" />
            </h2>
          </div>

          <div className="grid sm:grid-cols-5 grid-cols-1 gap-2 mx-10 justify-center">
            <div className="sm:col-start-2 bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
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

            <div className="bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
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

            <div className="bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
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
  );
}

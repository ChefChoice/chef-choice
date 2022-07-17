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
        <main className="background-image flex h-1/3 w-full flex-col justify-center py-4 sm:h-screen">
          <div className="grid sm:grid-cols-5">
            <h2 className="font-headline grid break-words text-3xl font-medium sm:col-span-3 sm:col-start-2 sm:text-4xl">
              Marketplace Management
              <hr className="mb-5 border-t-2 border-black/[.50]" />
            </h2>
          </div>

          <div className="mx-10 grid grid-cols-1 justify-center gap-2 sm:grid-cols-5">
            <div className="hover:border-green overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring sm:col-start-2">
              <Image
                src="/images/dishMgt.jpg"
                layout="responsive"
                width={2100}
                height={1900}
                alt="dish image"
              />

              <div className="py-5 px-5 text-right">
                <Link href="/dish-management">
                  <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                    Manage Dishes
                  </a>
                </Link>
              </div>
            </div>

            <div className="hover:border-green overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
              <Image
                src="/images/reviewMgt.jpg"
                layout="responsive"
                width={2100}
                height={1900}
                alt="review image"
              />

              <div className="py-5 px-5 text-right">
                <Link href="#">
                  <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                    Manage Reviews
                  </a>
                </Link>
              </div>
            </div>

            <div className="hover:border-green overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
              <Image
                src="/images/scheduleMgt.jpg"
                layout="responsive"
                width={2100}
                height={1900}
                alt="schedule image"
              />

              <div className="py-5 px-5 text-right">
                <Link href="/schedule">
                  <a className="xs:text-xs font-bold text-white hover:text-black  lg:text-base">
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

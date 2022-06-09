import type { NextPage } from 'next';
import Head from 'next/head';
import { withPageAuth } from '@supabase/supabase-auth-helpers/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export const getServerSideProps = withPageAuth({
  redirectTo: '/signin',
});

const OrderManagement: NextPage = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className="flex h-1/3  w-full flex-col justify-center py-4 px-0 md:h-screen">
          <div className="flex justify-center gap-2 pt-5 md:w-full">
            <Link href="/order-management/kitchen">
              <div className="hover:border-green w-full max-w-xs overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
                <Image
                  src="/images/dishMgt.jpg"
                  layout="responsive"
                  width={2100}
                  height={1900}
                  alt="dish image"
                />

                <div className="py-5 px-5 text-right">
                  <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                    Create Order
                  </a>
                </div>
              </div>
            </Link>
            <Link href="/order-management/orders">
              <div className="hover:border-green w-full max-w-xs overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:border-4 hover:bg-green-hover hover:ring">
                <Image
                  src="/images/dishMgt.jpg"
                  layout="responsive"
                  width={2100}
                  height={1900}
                  alt="dish image"
                />

                <div className="py-5 px-5 text-right">
                  <a className="xs:text-xs font-bold text-white hover:text-black lg:text-base">
                    Orders
                  </a>
                </div>
              </div>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default OrderManagement;

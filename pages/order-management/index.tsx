import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const OrderManagement: NextPage = () => {
  return (
    <>
      <Head>
        <title>Orders</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className="md:h-screen h-1/3  w-full py-4 px-0 flex flex-col justify-center">
          <div className="md:w-full flex gap-2 pt-5 justify-center">
            <Link href="/order-management/kitchen">
              <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
                <Image
                  src="/images/dishMgt.jpg"
                  layout="responsive"
                  width={2100}
                  height={1900}
                  alt="dish image"
                />

                <div className="py-5 px-5 text-right">
                  <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                    Create Order
                  </a>
                </div>
              </div>
            </Link>
            <Link href="/order-management/orders">
              <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring hover:bg-green-hover">
                <Image
                  src="/images/dishMgt.jpg"
                  layout="responsive"
                  width={2100}
                  height={1900}
                  alt="dish image"
                />

                <div className="py-5 px-5 text-right">
                  <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
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

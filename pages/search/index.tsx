import type { NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const Search: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex flex-col justify-center items-center background-image w-full py-32">
        <div className="w-2/3 mb-9 border-b-2 border-black text-3xl font-medium">
          <h2>Search</h2>
        </div>
        <div className="w-2/3 flex flex-row justify-around items-center">
          <div className="w-1/4 bg-green-light border-solid border-2 border-green-light rounded text-white hover:ring hover:bg-green-hover hover:border-green-hover hover:text-black">
            <Link href="/search/search-dish">
              <a>
                <Image
                  src="/images/dishMgt.jpg"
                  width={2100}
                  height={1900}
                  layout="responsive"
                  alt=""
                />

                <div className="py-5 px-5 text-right font-bold">Search By Dish</div>
              </a>
            </Link>
          </div>
          <div className="w-1/4 bg-green-light border-solid border-2 border-green-light rounded text-white hover:ring hover:bg-green-hover hover:border-green-hover hover:text-black">
            <Link href="#">
              <a>
                <Image
                  src="/images/dishMgt.jpg"
                  width={2100}
                  height={1900}
                  layout="responsive"
                  alt=""
                />

                <div className="py-5 px-5 text-right font-bold">Search By Category</div>
              </a>
            </Link>
          </div>
          <div className="w-1/4 bg-green-light border-solid border-2 border-green-light rounded text-white hover:ring hover:bg-green-hover hover:border-green-hover hover:text-black">
            <Link href="#">
              <a>
                <Image
                  src="/images/dishMgt.jpg"
                  width={2100}
                  height={1900}
                  layout="responsive"
                  alt=""
                />

                <div className="py-5 px-5 text-right font-bold">Search By Chef</div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;

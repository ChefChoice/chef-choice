import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';

//TODO: add navigation

const Marketplace: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Marketplace</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <main className={`${styles.body} ${styles.bgImage}`}>
        <div className="grid md:grid-cols-5 py-8 pl-3 text-2xl font-headline font-bold">
          <h2 className="col-start-2 col-span-3 xs:text-xl">
            Marketplace Management
            <hr style={{ borderTop: '2px solid #000000' }} />
          </h2>
        </div>

        <div className="w-full grid md:grid-cols-5 grid-cols-1 gap-2 pl-3 pt-5 place-items-center">
          <div className="max-w-xs w-full md:col-start-2 bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring">
            <Image
              src="/images/dishMgt.jpg"
              layout="responsive"
              width={2100}
              height={1900}
              alt="dish image"
            />

            <div className="py-5 px-5 text-right">
              <Link href="#">
                <a className="font-bold text-white lg:text-base xs:text-xs hover:text-black">
                  Manage Dishes
                </a>
              </Link>
            </div>
          </div>

          <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring">
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

          <div className="max-w-xs w-full bg-green-light rounded overflow-hidden shadow-lg border-solid border-2 border-green-light hover:border-4 hover:border-green hover:ring">
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
  );
};

export default Marketplace;

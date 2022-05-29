import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

//TODO: replace username and option cards; add navigation

const MainMenu: NextPage = () => {
  return (
    <>
      <Head>
        <title>Main Menu</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className="background-image h-screen w-screen py-4 flex flex-col justify-center items-center">
          <h1 className="font-headline font-medium text-4xl break-words">
            {/* TODO: replace username */}
            Welcome to ChefChoice, Alastair
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

            <Link href="#">
              <a className="flex justify-center items-center mx-auto py-2 px-2 bg-green-light text-white text-xl rounded-lg hover:bg-green-hover md:w-full w-3/4 h-20">
                <h2>Marketplace Management</h2>
              </a>
            </Link>

            <Link href="#">
              <a className="flex justify-center items-center mx-auto py-2 px-2 bg-green-light text-white text-xl rounded-lg hover:bg-green-hover md:w-full w-3/4 h-20">
                <h2>My Account</h2>
              </a>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default MainMenu;

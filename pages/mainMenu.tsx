import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

//TODO: replace username and option cards; add navigation

const MainMenu: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Main Menu</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>

      <div className="mx-auto">
        <main className={`${styles.bgImage} ${styles.main}`}>
          <h1 className={styles.title}>
            {/* TODO: replace username */}
            Welcome to ChefChoice, Alastair
            <hr style={{ borderTop: '3px solid #000000 ' }} />
          </h1>
          <div className="grid grid-rows-3 grid-flow-col gap-2 pt-10">
            {/* TODO: Change the option cards according to the type of user*/}
            {2 > 1 ? (
              <Link href="#">
                <a className={styles.mainMenuCard}>
                  <h2>Orders</h2>
                </a>
              </Link>
            ) : (
              <Link href="#">
                <a className={styles.mainMenuCard}>
                  <h2>Search Dishes</h2>
                </a>
              </Link>
            )}

            <Link href="#">
              <a className={styles.mainMenuCard}>
                <h2>Marketplace Management</h2>
              </a>
            </Link>

            <Link href="#">
              <a className={styles.mainMenuCard}>
                <h2>My Account</h2>
              </a>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainMenu;

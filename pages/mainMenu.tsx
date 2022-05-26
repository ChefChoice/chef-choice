import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

// import backgroundImage from '../public/backgroundImage.jpg';
//TODO: navbar, options cards, footer

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
      </Head>
      {/* Take navbar from component, modify according to the type of user */}
      <main className={`${styles.main} ${styles.bgImage}`}>
        {/* <Image src={backgroundImage} layout="fill" objectFit="cover" alt="bgImage" /> */}
        <h1 className={styles.title}>
          Welcome to ChefChoice <hr style={{ borderTop: '3px solid #000000 ' }} />
        </h1>

        <div className="grid grid-rows-3 grid-flow-col gap-2 pt-10">
          {/* Change the content according to the type of user 
              Write if else expression directly here (as example) or write a function that returns accordingly */}
          {2 > 1 ? (
            <a href="#" className={styles.mainMenuCard}>
              <h2>Orders</h2>
            </a>
          ) : (
            <a href="#" className={styles.mainMenuCard}>
              <h2>Search Dishes</h2>
            </a>
          )}
          <a href="#" className={styles.mainMenuCard}>
            <h2>Marketplace Management</h2>
          </a>
          <a href="#" className={styles.mainMenuCard}>
            <h2>My Account</h2>
          </a>
        </div>
      </main>

      {/* Take footer from component */}
      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

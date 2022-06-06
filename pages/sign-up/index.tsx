import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const SignUp: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up - CHEFCHOICE</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <main>
        <div className="bg-default bg-cover w-screen flex h-screen mx-auto">
          <span className="text-base font-sans">
            <Link href="/chef">Chef Signup</Link>
            <br />
            <Link href="/consumer">Consumer Signup</Link>
          </span>
        </div>
      </main>
    </>
  );
};

export default SignUp;

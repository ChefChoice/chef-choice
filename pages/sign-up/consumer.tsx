// pages/sign-up/consumer.tsx

import { supabase } from '../../utils/supabaseClient';
import { ChangeEvent, FormEvent, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error: userError } = await supabase.auth.signUp(
      { email, password },
      {
        data: {
          type: 'consumer',
          name: firstName.concat(' ', lastName),
        },
      }
    );

    if (userError) {
      alert(userError.message);
      console.log(userError);
      throw userError;
    } else {
      router.push('./success');
    }
  };

  // TODO: Add password re-entry for verification
  return (
    <>
      <Head>
        <title>Consumer Sign Up - CHEFCHOICE</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <main>
        <div className="bg-default bg-cover w-screen h-screen md:grid md:grid-cols-2 md:gap-4 md:place-content-center">
          <div className="bg-white px-4 py-4 mx-2 mt-2 mb-1 inline-block md:my-2 md:w-96 md:justify-self-end">
            <h1 className="text-4xl font-sans font-bold mb-4">Discover authentic home-made food</h1>
            <span className="text-base font-sans">
              <span className="font-bold">CHEFCHOICE</span> gives you a wide selection of home-made
              food prepared by qualified home chefs across the Greater Toronto Area, all with
              affordable prices.
              <br />
              <br />
              Join us and place your first order today!
            </span>
          </div>
          <div className="bg-white px-4 py-4 mx-2 mt-1 mb-2 inline-block md:my-2 md:w-96 md:justify-self-start">
            <div className="px-1 mb-4">
              <p className="text-2xl font-sans font-bold">Get Started</p>
            </div>
            <form onSubmit={handleSubmit} className="mb-2">
              <div className="flex justify-between">
                <input
                  className="w-1/2 rounded px-3 py-2 mb-4 mr-2 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
                  placeholder="First Name"
                  id="input-firstname"
                  type="text"
                  value={firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                  required
                />
                <input
                  className="w-1/2 rounded px-3 py-2 mb-4 ml-2 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
                  placeholder="Last Name"
                  id="input-lastname"
                  type="text"
                  value={lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                  required
                />
              </div>
              <input
                className="w-full rounded px-3 py-2 mb-4 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
                placeholder="Email Address"
                id="input-email"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full rounded px-3 py-2 mb-4 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
                placeholder="Password"
                id="input-password"
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <input
                className="w-full rounded px-3 py-2 mb-2 bg-gray-200 border-gray-200 border-2 hover:border-green-light focus:outline-none focus:bg-white focus:border-green-light"
                placeholder="Confirm Password"
                id="input-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              />
              <button
                className="block max-w-sm bg-green-light hover:bg-green-hover border-green-light hover:border-green-hover py-2 px-2 text-white rounded w-full"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
